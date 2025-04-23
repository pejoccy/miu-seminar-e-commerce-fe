import { aws_s3, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as pipelines from 'aws-cdk-lib/pipelines';
import * as iam from 'aws-cdk-lib/aws-iam';
import { StaticSiteStage } from './site-stage';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const connectionArn = process.env.REPO_CONNECTION_ARN!;

    const artifactBucket = new aws_s3.Bucket(this, 'ArtifactBucket', {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    
    const pipeline = new pipelines.CodePipeline(this, "CS516ProjectSitePipeline", {
      pipelineName: "CS516ProjectSitePipeline",
      artifactBucket,
      synth: new pipelines.CodeBuildStep("Synth", {
        input: pipelines.CodePipelineSource.connection(
          "pejoccy/miu-seminar-e-commerce-fe",
          "main",
          {
            connectionArn,
            triggerOnPush: true,
          },
        ),
        
        installCommands: [
            "npm install -g aws-cdk"
        ],
        commands: [
          // 1. Set it as a React env var (REACT_APP_* gets embedded at build time)
          // 'export REACT_APP_API_URL=$(aws ssm get-parameter --name "/cs516-project-api/api-url" --with-decryption --query "Parameter.Value" --output text)',
          'echo "API URL:" $REACT_APP_API_URL',

          // 2. Site - Install, build
          "pwd",
          "npm ci",
          "npm run build",
          "pwd",
          "ls -l",
          
          // 3. Synth infra
          "cd infra",
          "npm ci",
          "pwd",
          "ls -l",
          "cdk synth -c apiUrl=$REACT_APP_API_URL"
        ],
        rolePolicyStatements: [
          new iam.PolicyStatement({
            actions: ['ssm:GetParameter'],
            resources: ['arn:aws:ssm:us-east-1:390402552664:parameter/cs516-project-api/api-url'],
          }),
        ],
      }),
    });

    artifactBucket.grantReadWrite(pipeline.pipeline.role!);

    pipeline.addStage(new StaticSiteStage(this, 'DeployStaticSite'));
  }
}
