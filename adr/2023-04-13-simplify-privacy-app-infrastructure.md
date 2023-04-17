As part of the Migration to AWS from Heroku, infrastructure for this was created and is hosted on AWS.

## Requires
- Terraform (https://www.terraform.io/)
- Terragrunt (https://terragrunt.gruntwork.io/)

## How is this repository structured?

The Terraform code contained in `aws` is split into several independent modules that all use their own remote Terraform state file. These modules know nothing about Terragrunt and are used by Terragrunt as simple infrastructure definitions.

The directory structure inside `aws` reflects the split into independent modules. For example, `ecr`, contains the lifecycle policy and configuration that creates the ECR that will be used by the `app (lambda)` module.

At the moment, there is only a production environment in the `env` which contains the Terragrunt scripts.

## What is each Terraform module

### [`aws/app`](terragrunt/aws/app)

Contains the Lambda function module that has read, write and root user access to the Elastic File System (EFS). Also contains the lambda function url that is used by the cloudfront module.

### [`aws/cloudfront`](terragrunt/aws/cloudfront)
Contains:
- Certificates: used to request a DNS validated certificate, deploy the required validation records and wait for validation to complete.
- Cloudfront: creates a Cloudfront web distribution and contains HTTP response headers and their values.
- IAM
- Route53
- S3: holds access logs
- WAF: WAFv2 Web ACL resource

### [`aws/ecr`](terragrunt/aws/ecr)
Contains the Elastic Container Registry (ECR) Repository, that will hold the docker image

### [`aws/efs`](terragrunt/aws/efs)
Contains resources to allow the storage for and access of the generated privacy statements

### [`aws/hosted_zone`](terragrunt/aws/hosted_zone)
Manages Route53 Hosted Zone

### [`aws/vpc`](terragrunt/aws/vpc)
Contains the VPC module and ingress and egress rules. It allows the lambda function to be able to access other resources in the VPC.


## Architectural Decision Record (ADR)

Use a Docker image based AWS Lambda function to run the App, accessed using a Lambda Function URL. A Cloudfront distribution will then provide a custom URL and caching. Data storage will be provided by EFS.

Using AWS Lambda with Cloudfront provides the following benefits:
1. Highly available and scalable as it is using AWS Lambda.
2. CloudFront will further improve the availability and performance by caching redirect responses and serving responses geographically close to the user.
3. The use of Lambda Function URLs entirely removes the need to manage an API Gateway instance.
4. Elastic File System (EFS) is used for storage. This required the least change from a code perspective. All we needed was a simple way to store and retrive the generated `.docx` file

![Diagram of Simplify Privacy Statements App](../public/img/Simplify\_Privacy\_app\_ADR.png) 