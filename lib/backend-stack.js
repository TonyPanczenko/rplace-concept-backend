const { Stack, aws_apigateway, aws_lambda, aws_dynamodb } = require('aws-cdk-lib');
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

    const pixelsDbTable = new aws_dynamodb.Table(this, 'pixelsDbTable', {
      partitionKey: { name: 'PK', type: aws_dynamodb.AttributeType.STRING }
    });

    const lambda = new aws_lambda.Function(this, 'addPixelLambda', {
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'api', 'add-pixel')),
      handler: 'handler',
      runtime: aws_lambda.Runtime[process.env.LAMBDA_RUNTIME],
      environment: {
        PIXELS_TABLE: pixelsDbTable.tableName
      }
    });

    pixelsDbTable.grantReadWriteData(lambda);

    const api = new aws_apigateway.RestApi(this, 'root');
    const addPixelResource = api.root.addResource('addPixel');
    addPixelResource.addCorsPreflight({
      allowOrigins: [ '*' ],
      allowMethods: [ 'POST' ],
      allowHeaders: [ 'x-api-key' ],
      allowCredentials: true,
    });
    addPixelResource.addMethod('POST', new aws_apigateway.LambdaIntegration(lambda), {
      requestValidator: new aws_apigateway.RequestValidator(this, 'addPixelBodyValidator', {
        restApi: api,
        requestValidatorName: 'addPixelBodyValidator',
        validateRequestBody: true
      }),
      requestModels: {
        
      }
    });
  }
}

module.exports = { BackendStack }; 
