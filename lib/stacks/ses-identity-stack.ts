import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkUtil } from '../../utils/cdk-util';
import { EmailIdentity, Identity } from 'aws-cdk-lib/aws-ses';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

/**
 * Stack for Amazon SES Identity
 */
export class SesIdentityStack extends Stack {
  // Initialize utility
  private util = CdkUtil.getInstance();

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get environment configuration
    const domainConfig = this.util.getEnvConfig('domain');
    const sesSendingConfig = this.util.getEnvConfig('sesSending');

    // Look up the hosted zone created in the Route53HostedZoneStack
    const hostedZone = PublicHostedZone.fromLookup(this, 'HostedZone', {
      domainName: domainConfig.name,
    });

    // Create an Amazon SES domain type Identity
    const sesIdentity = new EmailIdentity(this, 'SesDomainIdentity', {
      identity: Identity.publicHostedZone(hostedZone),
      mailFromDomain: `${sesSendingConfig.emailSendingDomainPart}.${domainConfig.name}`,
    });
  }
}
