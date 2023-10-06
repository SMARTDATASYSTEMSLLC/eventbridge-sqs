**AWS EventBridge and SQS Deployment**
Overview
This CloudFormation template automates the deployment of an AWS infrastructure that includes an EventBridge rule and an SQS queue. The purpose is to facilitate the processing of events and messages within your AWS environment.

Usage
Clone the Repository:
```
git clone <repository-url>
cd <repository-directory>
```
Update AWS Region:
Open the template.yml file and ensure that the AWS_REGION in the GitHub Actions workflow section matches your desired AWS region.

Configure AWS Credentials:
Update the GitHub Actions workflow (workflow.yml) with the appropriate IAM role ARN to assume during deployment.

Push to Feature Branch:
The workflow is triggered on a push event to the feature/cloudformationstack branch. Ensure your changes are pushed to this branch.

Monitor Deployment:
The GitHub Actions workflow deploys the CloudFormation stack, creating an EventBridge rule and an SQS queue. Monitor the workflow for any deployment issues.

Additional Notes
EventBridge Rule Configuration:
The MyEventRule in the CloudFormation template is configured to trigger on events with the source "custom.event". Modify the EventPattern section as needed to match your application's event structure.

Application Source Requirement:
As of the current configuration, the EventBridge rule triggers on a custom event source. To fully utilize this setup, ensure that your application generates events with the specified source to trigger EventBridge, which in turn sends messages to the SQS queue.

Manual Event Trigger:
In the absence of an automated application source, you can manually trigger events for testing purposes. Use the AWS Management Console or the AWS CLI to publish test events and observe the messages being sent to the SQS queue.

Troubleshooting
If you encounter issues during deployment, check the GitHub Actions workflow logs for error messages. Verify that AWS credentials are correctly configured, and the necessary IAM role permissions are in place.
Feel free to customize the write-up based on your specific use case and deployment details. This should provide users with clear instructions on how to use the CloudFormation template and address the requirement for an application source to trigger EventBridge events.

More Info on how the Template works:

**CF TEMPLATE**

```
AWSTemplateFormatVersion: '2010-09-09'
Description: Deploy EventBridge and SQS

Resources:
  MySqsQueue:
    Type: AWS::SQS::Queue

  MyEventRule:
    Type: AWS::Events::Rule
    Properties:
      Description: "EventRule"
      EventPattern:
        source:
          - "custom.event"
      Targets:
        - Arn: !GetAtt MySqsQueue.Arn
          Id: "SQSqueue"

Outputs:
  SQSqueueName:
    Description: SQS queue name
    Value: !GetAtt MySqsQueue.QueueName

  SQSqueueARN:
    Description: SQS queue ARN
    Value: !GetAtt MySqsQueue.Arn
```
These CloudFormation template for deploying an AWS stack that includes an EventBridge rule (MyEventRule) and an SQS queue (MySqsQueue). Here's a breakdown:

CloudFormation Template
AWSTemplateFormatVersion: Specifies the AWS CloudFormation template version.

Description: Describes the purpose of the template, which is to deploy EventBridge and SQS.

Resources
MySqsQueue: Defines an SQS queue.

MyEventRule: Defines an EventBridge rule with a custom event source ("custom.event") and a target that sends events to the SQS queue.

Outputs
SQSqueueName: Outputs the name of the SQS queue.

SQSqueueARN: Outputs the ARN of the SQS queue.

**GitHub Actions Workflow**

```
name: Deploy CloudFormation Stack

on:
  push:
    branches:
      - feature/cloudformationstack

env:
  AWS_REGION: "us-east-1"  #Change to your desired AWS regionS

permissions:
  id-token: write   #This is required for requesting the JWT 
  contents: read    # This is required for actions/checkout 

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Configure AWS credentials and Assume Role
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::958686716208:role/Github  # Change to reflect your IAM role’s ARN
          role-session-name: GitHub_to_AWS_via_FederatedOIDC
          aws-region: ${{ env.AWS_REGION }}

      - name: Deploy CloudFormation stack
        run: |

          aws cloudformation deploy \
            --template-file template.yml \
            --stack-name event-sqs \
            --capabilities CAPABILITY_IAM CAPABILITY_NAMED_IAM
```
name: Specifies the name of the workflow as "Deploy CloudFormation Stack."

on: Specifies that the workflow should run on a push event to the specified branch (feature/cloudformationstack).

env: Sets the AWS region to "us-east-1."

permissions: Specifies permissions required for the workflow, such as read access for repository contents and write access for the ID token.

Jobs
deploy: Configures a job named "deploy" that runs on the latest version of Ubuntu.

steps: Contains the following steps:

Checkout repository: Checks out the repository using GitHub Actions.

Configure AWS credentials and Assume Role: Configures AWS credentials and assumes the specified IAM role.

Deploy CloudFormation stack: Uses the AWS CLI to deploy the CloudFormation stack defined in template.yml with specified parameters.

Note:
You need to replace placeholders like **arn:aws:iam::958686716208:role/Github** with your actual values, such as the IAM role ARN and AWS region.

The GitHub Actions workflow is triggered only for pushes to the feature/cloudformationstack branch.

The CloudFormation stack is deployed with the aws cloudformation deploy command, specifying the template file, stack name, and capabilities.

Overall, this template automates the deployment of an AWS infrastructure for handling custom events using EventBridge and SQS.
