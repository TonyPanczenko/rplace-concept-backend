#!/usr/bin/env node

const cdk = require('aws-cdk-lib');
const { RplaceConceptBackendStack } = require('../lib/rplace-concept-backend-stack');

const app = new cdk.App();
new RplaceConceptBackendStack(app, 'RplaceConceptBackendStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  // env: { account: '123456789012', region: 'us-east-1' },
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
});
