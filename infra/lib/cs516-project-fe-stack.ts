import { Stack, CfnOutput, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { createCloudFrontDistro, createSiteS3Bucket } from './sevices';

export class Cs516ProjectFeStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const siteBucket = createSiteS3Bucket(this);
    const distribution = createCloudFrontDistro(this, siteBucket);

    // Output the S3 bucket name and CloudFront URL
    new CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
    });

    new CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}