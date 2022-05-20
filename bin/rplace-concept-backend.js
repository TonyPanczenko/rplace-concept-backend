#!/usr/bin/env node

const dotenv = require('dotenv');
const { App } = require('aws-cdk-lib');
const { BackendStack } = require('../lib/backend-stack');

dotenv.config();

const app = new App();
new BackendStack(app, 'BackendStack', {
  env: { 
    account: process.env.CDK_DEFAULT_ACCOUNT, 
    region: process.env.CDK_DEFAULT_REGION, 
  },
});
