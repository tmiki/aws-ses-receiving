#!/usr/bin/env node
import 'source-map-support/register';
import { App } from 'aws-cdk-lib';
import { Route53HostedZoneStack } from '../lib/stacks/route53-hosted-zone-stack';
import { SesIdentityStack } from '../lib/stacks/ses-identity-stack';
import { SesEmailReceivingStack } from '../lib/stacks/ses-email-receiving-stack';
import { CdkUtil } from '../utils/cdk-util';

// Get environment name from environment variable
const util = CdkUtil.getInstance();

// Define environment for all stacks
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

// Create the Route53 Hosted Zone stack
new Route53HostedZoneStack(app, util.naming.generateResourceName('route53-hosted-zone'), {
  env,
  description: 'Stack for Route53 Hosted Zone',
});

// Create the SES Identity stack
new SesIdentityStack(app, util.naming.generateResourceName('ses-identity'), {
  env,
  description: 'Stack for Amazon SES Identity',
});

// Create the SES Email Receiving stack
new SesEmailReceivingStack(app, util.naming.generateResourceName('ses-email-receiving'), {
  env,
  description: 'Stack for SES Email Receiving resources',
});
