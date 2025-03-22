import { RemovalPolicy } from 'aws-cdk-lib';

export type DomainConfig = {
  /**
   * Main domain name (e.g., example.com)
   */
  name: string;

  /**
   * Whether to destroy the domain or not on cdk destroy
   */
  removalPolicy: RemovalPolicy;
};

export type SesSending = {
  /**
   * Email domain part name for sending (e.g., mail-send)
   */
  emailSendingDomainPart: string;
};

export type SesReceiving = {
  /**
   * Email domain part name for receiving (e.g., mail-recv)
   */
  emailReceivingDomainPart: string;

  /**
   * S3 bucket retaining emails configuration
   */
  s3Bucket: {
    autoDeleteObjects: boolean;
    expirationDays: number;
    removalPolicy: RemovalPolicy;
  };

  /**
   * SES configuration
   */
  ses: {
    receiptRuleSetName: string;
    scanEnabled: boolean;
    objectKeyPrefix: string;
  };
};

/**
 * Environment configuration interface
 */
export type EnvConfig = {
  domain: DomainConfig;
  sesSending: SesSending;
  sesReceiving: SesReceiving;
};

// EnvConfigのキーを1階層目に指定可能にするための型
export type EnvConfigKey = keyof EnvConfig;
