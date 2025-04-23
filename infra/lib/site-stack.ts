import { Stack, CfnOutput, StackProps, aws_s3_deployment } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { createCloudFrontDistro, createSiteS3Bucket } from './services';
import { Source } from 'aws-cdk-lib/aws-s3-deployment';

export class StaticSiteStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const apiURL = this.node.tryGetContext('apiUrl') as string;

    const siteBucket = createSiteS3Bucket(this, [apiURL]);
    const distribution = createCloudFrontDistro(this, siteBucket);

    const assetSrc = path.join(__dirname, '../../build');

    // Upload site contents from build output
    new aws_s3_deployment.BucketDeployment(this, 'DeployWebsite', {
      sources: [Source.asset(assetSrc)],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ['/*'], // N.B. invalidate everything
    });

    // Output the S3 bucket name and CloudFront URL
    new CfnOutput(this, 'SiteBucketName', {
      value: siteBucket.bucketName,
    });

    new CfnOutput(this, 'CloudFrontURL', {
      value: `https://${distribution.distributionDomainName}`,
    });
  }
}