import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { Route53HostedZoneStack } from '../lib/stacks/route53-hosted-zone-stack';
import { SesIdentityStack } from '../lib/stacks/ses-identity-stack';
import { SesEmailReceivingStack } from '../lib/stacks/ses-email-receiving-stack';
import { EnvConfigTest } from '../envconfig/env-test';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { CdkUtil } from '../utils/cdk-util';

const cdkUtil = CdkUtil.getInstance();

describe('Route53HostedZoneStack', () => {
  // Prepare the CFn template for testing.
  const app = new cdk.App();

  const stack = new Route53HostedZoneStack(app, 'TestRoute53HostedZoneStackTest', { env: cdkUtil.e.environmentPassingInStack });
  const template = Template.fromStack(stack);

  test('Stack creates Route53 Hosted Zone', () => {
    // Verify Route53 Hosted Zone is created
    const domainName = cdkUtil.getEnvConfig('domain').name;
    template.hasResourceProperties('AWS::Route53::HostedZone', {
      Name: `${domainName}.`,
    });
  });
});
