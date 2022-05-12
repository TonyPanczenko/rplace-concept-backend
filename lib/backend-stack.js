const { Stack } = require('aws-cdk-lib');
const {
  Table,
  AttributeType
} = require('aws-cdk-lib/aws-dynamodb');
const {
  Function,
  Code,
  Runtime
} = require('aws-cdk-lib/aws-lambda');
const {
  RestApi,
  LambdaIntegration,
  RequestValidator,
  Model, 
  JsonSchemaType 
} = require('aws-cdk-lib/aws-apigateway');
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
      partitionKey: { name: 'PK', type: AttributeType.STRING }
    });

    const lambda = new Function(this, 'addPixelLambda', {
      code: Code.fromAsset(path.join(__dirname, 'api', 'add-pixel')),
      handler: 'handler',
      runtime: Runtime[process.env.LAMBDA_RUNTIME],
      environment: {
        PIXELS_TABLE: pixelsDbTable.tableName
      }
    });

    pixelsDbTable.grantReadWriteData(lambda);

    const api = new RestApi(this, 'root');
    const addPixelResource = api.root.addResource('addPixel');
    addPixelResource.addCorsPreflight({
      allowOrigins: ['*'],
      allowMethods: ['POST'],
      allowHeaders: ['x-api-key'],
      allowCredentials: true,
    });
    const addPixelBodyValidator = new RequestValidator(this, 'addPixelBodyValidator', {
      restApi: api,
      requestValidatorName: 'addPixelBodyValidator',
      validateRequestBody: true
    });
    const addPixelBodyModel = new Model(this, 'addPixelBodyModel', {
      restApi: api,
      contentType: 'application/json',
      description: 'Validates body of the request',
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
    addPixelResource.addMethod('POST', new LambdaIntegration(lambda), {
      requestValidator: addPixelBodyValidator,
      requestModels: {
        'application/json': addPixelBodyModel,
      }
    });
  }
}

module.exports = { BackendStack }; 
