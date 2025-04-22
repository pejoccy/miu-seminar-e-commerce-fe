import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';

export function createSiteS3Bucket(scope: Construct, allowedOrigins: string[]): s3.Bucket {
  const siteBucket = new s3.Bucket(scope, 'SiteBucket', {
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });

  siteBucket.addCorsRule({
    allowedOrigins,
    allowedMethods: [
      s3.HttpMethods.HEAD,
      s3.HttpMethods.GET,
      s3.HttpMethods.PUT,
      s3.HttpMethods.POST,
      s3.HttpMethods.DELETE
    ],
    allowedHeaders: ['*'],
  });

  return siteBucket;
}
