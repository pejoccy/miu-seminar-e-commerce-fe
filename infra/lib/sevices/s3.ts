import { Construct } from "constructs";
import { RemovalPolicy } from "aws-cdk-lib";
import * as s3 from 'aws-cdk-lib/aws-s3';

export function createSiteS3Bucket(scope: Construct): s3.Bucket {
  return new s3.Bucket(scope, 'SiteBucket', {
    websiteIndexDocument: 'index.html',
    websiteErrorDocument: 'index.html',
    publicReadAccess: false,
    removalPolicy: RemovalPolicy.DESTROY,
    autoDeleteObjects: true,
  });
}
