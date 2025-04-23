import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export function createCloudFrontDistro(scope: Construct, siteBucket: s3.Bucket): cloudfront.Distribution {
  const originAccessIdentity = new cloudfront.OriginAccessIdentity(scope, 'OAI', {
    comment: 'OAI for CloudFront access to S3',
  });

  siteBucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [`${siteBucket.bucketArn}/*`],
    principals: [
      new iam.CanonicalUserPrincipal(originAccessIdentity.cloudFrontOriginAccessIdentityS3CanonicalUserId)
    ]
  }));
  
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
