import { RemovalPolicy } from 'aws-cdk-lib';
import { EnvConfig } from './types';

export const EnvConfigDev: EnvConfig = {
  domain: {
    name: 'dev.tmiki.work',
    removalPolicy: RemovalPolicy.DESTROY,
  },
  sesSending: {
    emailSendingDomainPart: 'mail-send',
  },
  sesReceiving: {
    emailReceivingDomainPart: 'mail-recv',
    s3Bucket: {
      autoDeleteObjects: true,
      expirationDays: 365,
      removalPolicy: RemovalPolicy.DESTROY,
    },
    ses: {
      receiptRuleSetName: 'EmailReceivingRuleSet1',
      scanEnabled: true,
      objectKeyPrefix: 'emails/',
    },
  },
};
