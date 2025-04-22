import { aws_s3, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { CodePipeline, CodePipelineSource, CodeBuildStep } from 'aws-cdk-lib/pipelines';
import { StaticSiteStage } from './site-stage';
// import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const connectionArn = process.env.REPO_CONNECTION_ARN!;

    const artifactBucket = new aws_s3.Bucket(this, 'ArtifactBucket', {
      versioned: false,
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });
    
    const pipeline = new CodePipeline(this, "SitePipeline", {
      pipelineName: "SitePipeline",
      artifactBucket,
      synth: new CodeBuildStep("Synth", {
        input: CodePipelineSource.connection(
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
          'export REACT_APP_API_URL=$(aws ssm get-parameter --name "/cs516-project-api/api-url" --with-decryption --query "Parameter.Value" --output text)',
          
          // 2. Change directory 
          "cd infra",

          // 3. Install, build, synth
          "npm ci",
          "npm run build",
          "npx cdk synth"
        ],
        // rolePolicyStatements: [
        //   new PolicyStatement({
        //     actions: ['ssm:GetParameter'],
        //     resources: ['arn:aws:ssm:*:*:/cs516-project-api/api-url'],
        //   }),
        // ],
      }),
    });

    pipeline.addStage(new StaticSiteStage(this, 'DeployStaticSite'));
  }
}
