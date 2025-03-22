import { RemovalPolicy, Duration } from 'aws-cdk-lib';
import { Bucket, BucketProps } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

/**
 * Properties for S3BucketBaseline
 */
export interface S3BucketBaselineProps {
  /**
   * Name of the bucket
   */
  bucketName: string;

  /**
   * Whether to auto-delete objects when the bucket is removed
   * @default false
   */
  autoDeleteObjects?: boolean;

  /**
   * Removal policy for the bucket
   * @default RemovalPolicy.RETAIN
   */
  removalPolicy?: RemovalPolicy;

  /**
   * Expiration period for objects in the bucket
   * @default 365 days
   */
  expirationDays?: number;
}

/**
 * Baseline pattern for S3 buckets with standard configurations
 */
export class S3BucketBaseline extends Bucket {
  constructor(scope: Construct, id: string, props: S3BucketBaselineProps) {
    const {
      bucketName,
      autoDeleteObjects = false,
      removalPolicy = RemovalPolicy.RETAIN,
      expirationDays = 365
    } = props;

    const bucketProps: BucketProps = {
      bucketName,
      autoDeleteObjects,
      removalPolicy,
      lifecycleRules: [
        {
          expiration: Duration.days(expirationDays),
          id: 'ObjectRetention',
        },
      ],
    };

    super(scope, id, bucketProps);
  }
}
