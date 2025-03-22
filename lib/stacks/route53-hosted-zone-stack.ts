import { Stack, StackProps, RemovalPolicy } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Route53HostedZone } from '../patterns/route53-hosted-zone';
import { CdkUtil } from '../../utils/cdk-util';

/**
 * Stack for Route53 Hosted Zone
 */
export class Route53HostedZoneStack extends Stack {
  // Initialize utility
  private util = CdkUtil.getInstance();

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get environment configuration
    const domainConfig = this.util.getEnvConfig('domain');

    // Domain configuration from environment config
    const domainName = domainConfig.name;

    // Create a Route53 hosted zone for the domain
    const route53HostedZoneName = this.util.getResourceNameString(id);
    const route53HostedZone = new Route53HostedZone(this, route53HostedZoneName.pascalCase, {
      domainName: domainName,
      comment: 'Hosted zone for SES email receiving',
    });
    route53HostedZone.hostedZone.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
}
