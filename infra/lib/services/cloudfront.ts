import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export function createCloudFrontDistro(
  scope: Construct,
  siteBucket: s3.Bucket,
): cloudfront.Distribution {
  const originAccessControl = new cloudfront.S3OriginAccessControl(scope, 'OAC', {
    signing: {
      behavior: cloudfront.SigningBehavior.ALWAYS,
      protocol: cloudfront.SigningProtocol.SIGV4,
    },
    originAccessControlName: 'S3OriginAccessControl',
  });
  
  const distribution = new cloudfront.Distribution(scope, 'SiteDistribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(siteBucket, {
        originAccessControlId: originAccessControl.originAccessControlId,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
  });

  siteBucket.addToResourcePolicy(new iam.PolicyStatement({
    actions: ['s3:GetObject'],
    resources: [`${siteBucket.bucketArn}/*`],
    principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
    conditions: {
      StringEquals: {
        'AWS:SourceArn': distribution.distributionArn,
      },
    },
  }));

  return distribution;
}
