#!/usr/bin/env node

const dotenv = require('dotenv');
dotenv.config();

const cdk = require('aws-cdk-lib');
const { RplaceConceptBackendStack } = require('../lib/rplace-concept-backend-stack');

const app = new cdk.App();
new RplaceConceptBackendStack(app, 'RplaceConceptBackendStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION, 
  },
});
