const { Stack, aws_apigateway, aws_lambda, aws_dynamodb } = require('aws-cdk-lib');
const path = require('path');

class RplaceConceptBackendStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    const pixelsDbTable = new aws_dynamodb.Table(this, 'pixelsDbTable', {
      partitionKey: { name: 'id', type: aws_dynamodb.AttributeType.STRING }
    });

    const lambda = new aws_lambda.Function(this, 'addPixelLambda', {
      code: aws_lambda.Code.fromAsset(path.join(__dirname, 'add-pixel')),
      handler: 'handler',
      runtime: aws_lambda.Runtime[process.env.LAMBDA_RUNTIME],
      environment: {
        PIXELS_TABLE: pixelsDbTable.tableName
      }
    });

    const api = new aws_apigateway.RestApi(this, 'root');

    api.root.addResource('addPixel')
      .addMethod('POST', new aws_apigateway.LambdaIntegration(lambda));
  }
}

module.exports = { RplaceConceptBackendStack }; 
