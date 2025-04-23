import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export function createCloudFrontDistro(
  scope: Construct,
  siteBucket: s3.Bucket,
): cloudfront.Distribution {
  const originAccessControl = new cloudfront.CfnOriginAccessControl(scope, 'SiteOAC', {
    originAccessControlConfig: {
      name: 'StaticSiteOAC',
      signingBehavior: 'always',
      signingProtocol: 'sigv4',
      originAccessControlOriginType: cloudfront.OriginAccessControlOriginType.S3,

    }
  });

  const distribution = new cloudfront.Distribution(scope, 'SiteDistribution', {
    defaultBehavior: {
      origin: new origins.S3Origin(siteBucket, {
        originAccessControlId: originAccessControl.attrId,
      }),
      viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    },
    defaultRootObject: 'index.html',
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
