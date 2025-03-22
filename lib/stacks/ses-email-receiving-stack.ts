import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CdkUtil } from '../../utils/cdk-util';
import { S3BucketBaseline } from '../patterns/s3bucket-baseline';
import { SesEmailReceiving } from '../patterns/ses-email-receiving';
import { MxRecord, PublicHostedZone } from 'aws-cdk-lib/aws-route53';

/**
 * Stack for AWS SES email receiving configuration
 */
export class SesEmailReceivingStack extends Stack {
  // Initialize utility
  private util = CdkUtil.getInstance();

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Get environment configuration
    const domainConfig = this.util.getEnvConfig('domain');
    const sesReceivingConfig = this.util.getEnvConfig('sesReceiving');
    const emailDomainName = `${sesReceivingConfig.emailReceivingDomainPart}.${domainConfig.name}`;

    // Create an S3 bucket for storing received emails
    const bucketName = this.util.getResourceNameString('ses-emails');
    const emailBucket = new S3BucketBaseline(this, 'SesEmailsBucket', {
      bucketName: bucketName.kebabCaseWithAccountIdCurrentRegion,
      autoDeleteObjects: sesReceivingConfig.s3Bucket.autoDeleteObjects,
      removalPolicy: sesReceivingConfig.s3Bucket.removalPolicy,
      expirationDays: sesReceivingConfig.s3Bucket.expirationDays,
    });

    // Configure SES email receiving
    const sesEmailReceiving = new SesEmailReceiving(this, 'SesEmailReceiving', {
      emailDomainName: emailDomainName,
      emailBucket: emailBucket,
      objectKeyPrefix: sesReceivingConfig.ses.objectKeyPrefix,
      scanEnabled: sesReceivingConfig.ses.scanEnabled,
      receiptRuleSetName: sesReceivingConfig.ses.receiptRuleSetName,
    });

    // SES受信用のMXレコードを追加
    const hostedZone = PublicHostedZone.fromLookup(this, 'HostedZone', {
      domainName: domainConfig.name,
    });
    new MxRecord(this, 'SesEmailReceivingMxRecord', {
      zone: hostedZone,
      recordName: emailDomainName,
      values: [
        {
          priority: 10,
          hostName: `inbound-smtp.${this.region}.amazonaws.com`,
        },
      ],
      ttl: Duration.minutes(30),
    });
  }
}
