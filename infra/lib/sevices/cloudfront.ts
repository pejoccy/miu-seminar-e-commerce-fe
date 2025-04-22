import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export function createCloudFrontDistro(scope: Construct, siteBucket: s3.Bucket): cloudfront.Distribution {
  const originAccessIdentity = new cloudfront.OriginAccessIdentity(scope, 'OAI', {
    comment: 'OAI for CloudFront access to S3',
  });
  
  return new cloudfront.Distribution(scope, 'SiteDistribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(siteBucket, {
        originAccessIdentity,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },

    defaultRootObject: 'index.html',
  });
}
