import { Construct } from 'constructs';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';

export function createCodeBuild(scope: Construct, accountId: string): codebuild.Project {
  const buildProject = new codebuild.Project(scope, 'SiteBuildProject', {
    source: codebuild.Source.gitHub({
      owner: 'pejoccy',
      repo: 'miu-seminar-e-commerce-fe',
      webhook: true,
      webhookFilters: [
        codebuild.FilterGroup.inEventOf(codebuild.EventAction.PUSH).andBranchIs('main'),
      ],
    }),
    environment: {
      buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      environmentVariables: {
        NODE_ENV: { value: 'production' },
      },
    },
    buildSpec: codebuild.BuildSpec.fromSourceFilename('buildspec.yml'),
  });

  // Grant access to fetch the API URL from Parameter Store
  buildProject.role?.addToPrincipalPolicy(new iam.PolicyStatement({
    actions: ['ssm:GetParameter'],
    resources: [`arn:aws:ssm:us-east-1:${accountId}:parameter/cs516-project-api/api-url`],
  }));
  
  return buildProject;
}
