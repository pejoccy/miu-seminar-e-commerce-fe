# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


Attach the Permission to the CDK Execution Role
Go to the IAM console:
https://console.aws.amazon.com/iam/

Find the role:
cdk-hnb659fds-cfn-exec-role-<account>-<region>

Click Add permissions → Attach policies directly → Create inline policy.

Use this JSON policy:

json
Copy
Edit
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "codestar-connections:PassConnection",
      "Resource": "arn:aws:codestar-connections:us-east-1:<account-id>:connection/<connection-id>"
    }
  ]
}
Replace:

<account-id> with your AWS account ID (e.g. 390402552664)

<connection-id> with the actual CodeStar connection ID (e.g. abc12345-...)

Save the policy with a name like AllowPassCodeStarConnection.