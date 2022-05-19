const { Stack } = require('aws-cdk-lib');
const {
  Table,
  AttributeType,
  BillingMode
} = require('aws-cdk-lib').aws_dynamodb;
const {
  Function,
  Code,
  Runtime
} = require('aws-cdk-lib').aws_lambda;
const {
  RestApi,
  LambdaIntegration,
  RequestValidator,
  Model, 
  JsonSchemaType, 
  Period
} = require('aws-cdk-lib').aws_apigateway;
const path = require('path');

class BackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const pixelsDbTable = new Table(this, 'pixelsDbTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      billingMode: BillingMode.PAY_PER_REQUEST
    });

    const addPixelLambda = new Function(this, 'addPixelLambda', {
      code: Code.fromAsset(path.join(__dirname, '..', 'dist', 'add-pixel')),
      handler: 'index.handler',
      runtime: Runtime[process.env.LAMBDA_RUNTIME],
      environment: {
        PIXELS_TABLE: pixelsDbTable.tableName
      }
    });

    pixelsDbTable.grantReadWriteData(addPixelLambda);

    const api = new RestApi(this, 'rPlaceConcept', {
      apiKeySourceType: 'HEADER',
      deployOptions: {
        stageName: 'production'
      }
    });
    const usagePlan = api.addUsagePlan('usagePlan', {
      quota: {
        limit: 1000,
        period: Period.DAY
      }
    });
    usagePlan.addApiStage({
      stage: api.deploymentStage,
    });
    const apiKey = api.addApiKey('apiKey');
    usagePlan.addApiKey(apiKey);
    // 
    const addPixelResource = api.root.addResource('add-pixel');
    addPixelResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['POST'],
      allowHeaders: ['X-API-key'],
      allowCredentials: true,
    });
    const addPixelBodyValidator = new RequestValidator(this, 'addPixelBodyValidator', {
      restApi: api,
      requestValidatorName: 'addPixelBodyValidator',
      validateRequestBody: true
    });
    const addPixelBodyModel = new Model(this, 'addPixelBodyModel', {
      restApi: api,
      description: 'Validates body of requests to add-pixel',
      modelName: 'addPixelBodyModel',
      schema: {
        type: JsonSchemaType.OBJECT,
        required: ['coordinates', 'color'],
        properties: {
          coordinates: {
            type: 'object',
            required: ['x', 'y'],
            properties: {
              x: {
                type: 'number'
              },
              y: {
                type: 'number'
              }
            }
          },
          color: {
            type: 'string'
          }
        } 
      }
    });
    addPixelResource.addMethod('POST', new LambdaIntegration(addPixelLambda), {
      requestValidator: addPixelBodyValidator,
      requestModels: {
        'application/json': addPixelBodyModel,
      }
    });

    const getImageLambda = new Function(this, 'getImageLambda', {
      code: Code.fromAsset(path.join(__dirname, '..', 'dist', 'get-image')),
      handler: 'index.handler',
      runtime: Runtime[process.env.LAMBDA_RUNTIME],
      environment: {
        PIXELS_TABLE: pixelsDbTable.tableName
      }
    });
    pixelsDbTable.grantReadData(getImageLambda);
    const getImageResource = api.root.addResource('get-image');
    getImageResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['GET'],
      allowHeaders: ['X-API-key'],
      allowCredentials: true,
    });
    getImageResource.addMethod('GET', new LambdaIntegration(addPixelLambda));
  }
}

module.exports = { BackendStack }; 
