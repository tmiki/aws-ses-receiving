import { Construct } from 'constructs';
import { EmailIdentity, Identity, ReceiptRuleSet } from 'aws-cdk-lib/aws-ses';
import { S3 } from 'aws-cdk-lib/aws-ses-actions';
import { IBucket } from 'aws-cdk-lib/aws-s3';
import { PublicHostedZone } from 'aws-cdk-lib/aws-route53';

/**
 * Properties for SesEmailReceiving
 */
export interface SesEmailReceivingProps {
  /**
   * Email domain name (e.g., mail.example.com)
   */
  emailDomainName: string;

  /**
   * S3 bucket for storing received emails
   */
  emailBucket: IBucket;

  /**
   * Prefix for email objects in the S3 bucket
   * @default 'emails/'
   */
  objectKeyPrefix?: string;

  /**
   * Whether to enable spam and virus scanning
   * @default true
   */
  scanEnabled?: boolean;

  /**
   * Name for the receipt rule set
   * @default 'EmailReceivingRuleSet'
   */
  receiptRuleSetName?: string;
}

/**
 * Pattern for SES email receiving configuration
 */
export class SesEmailReceiving extends Construct {
  /**
   * The SES domain identity
   */
  public readonly identity: EmailIdentity;

  /**
   * The SES receipt rule set
   */
  public readonly ruleSet: ReceiptRuleSet;

  constructor(scope: Construct, id: string, props: SesEmailReceivingProps) {
    super(scope, id);

    const { emailDomainName, emailBucket, objectKeyPrefix = 'emails/', scanEnabled = true, receiptRuleSetName = 'EmailReceivingRuleSet' } = props;

    // Create SES receipt rule set
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ses.ReceiptRuleSet.html
    this.ruleSet = new ReceiptRuleSet(this, 'ReceiptRuleSet', {
      receiptRuleSetName,
    });

    // Create SES receipt rule to store emails in S3
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_ses.ReceiptRuleOptions.html
    this.ruleSet.addRule('StoreEmailsIntoS3Rule', {
      receiptRuleName: 'StoreEmailsIntoS3Rule',
      recipients: [emailDomainName],
      enabled: true,
      scanEnabled,
      actions: [
        new S3({
          bucket: emailBucket,
          objectKeyPrefix,
          topic: undefined, // No SNS notification
        }),
      ],
    });
  }
}
