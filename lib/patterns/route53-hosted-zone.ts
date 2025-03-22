import { CfnOutput, Fn } from 'aws-cdk-lib';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

/**
 * Properties for Route53HostedZone
 */
export interface Route53HostedZoneProps {
  /**
   * Domain name for the hosted zone
   */
  domainName: string;

  /**
   * Comment for the hosted zone
   * @default undefined
   */
  comment?: string;
}

/**
 * Pattern for Route53 hosted zones
 */
export class Route53HostedZone extends Construct {
  /**
   * The Route53 hosted zone
   */
  public readonly hostedZone: PublicHostedZone;

  constructor(scope: Construct, id: string, props: Route53HostedZoneProps) {
    super(scope, id);

    const { domainName, comment } = props;

    // Create a Route53 hosted zone
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_route53.PublicHostedZone.html
    this.hostedZone = new PublicHostedZone(this, 'HostedZone', {
      zoneName: domainName,
      comment: comment,
    });

    // Output the nameservers for DNS configuration
    new CfnOutput(this, 'NameServers', {
      value: Fn.join(', ', this.hostedZone.hostedZoneNameServers || []),
      description: 'Nameservers for the hosted zone. Configure these in your domain registrar.',
    });
  }
}
