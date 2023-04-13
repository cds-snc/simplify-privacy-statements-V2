## Proof of Concept - Simplify Privacy Statements



Privacy is a complex policy area and is often used to shut down crucial user research or testing. Let's take the guess-work out of creating privacy and consent (P&C) notices for designers and researchers - maybe even for the entire government of Canada. Just as VAC has a logic to their benefits, so does a privacy and consent form. Let's create a tool that automatically generates P&C notices so that policy doesn't have to keep holding up the show.

_Mission Statement:_ Help CDS research and design spend more time with users, and less time fighting the bureaucracy.

_Goal:_ A working prototype that generates P&C statements.

Trello board: https://trello.com/b/vptWzBnE/generate-privacy-statements-portage

## Installing and running locally (Mac)

- Install `git`, `node` and `pandoc`. The best way to do this is probably using Homebrew (which you need to install first)
  - homebrew: `/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`
  - others: `brew install git node pandoc`
- You might want to set up ssh keys to make it easier to interact with GitHub. See [Generating a new SSH key and adding it to the ssh-agent](https://help.github.com/en/enterprise/2.16/user/articles/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent). Alternatively, you could use [GitHub Desktop](https://desktop.github.com/) or an IDE with integrated git support.
- Clone the repo locally and go into the repo directory
  - `git clone git@github.com:cds-snc/simplify-privacy-statements-V2.git`
  - `cd simplify-privacy-statements-V2`
- If you want to use Google Analytics or to send feedback or link emails, you have to set up proper environment variables. Copy the `.env.example` file into `.env` and set the variables appropriately.
- Next install the third party modules using `npm install`
- You can now run the app locally! run `npm run dev` and then open a web browser to `localhost:3000`.

## April 2023 Update

As part of the Migration to AWS from Heroku, infrastructure for this was created and is hosted on AWS.

# Requires
- Terraform (https://www.terraform.io/)
- Terragrunt (https://terragrunt.gruntwork.io/)

# How is this repository structured?

The Terraform code contained in `aws` is split into several independent modules that all use their own remote Terraform state file.These modules know nothing about Terragrunt and are used by Terragrunt as simple infrastructure definitions.

The directory structure inside `aws` reflects the split into independent modules. For example, `ecr`, contains the lifecycle policy and configuration that creates the ECR that will be used by the `app (lambda)` module.

At the moment, there is only a production environment in the `env` which contains the Terragrunt scripts.

# What is each Terraform module

`aws/app`

Contains the Lambda function module that has read, write and root user access to the Elastic File System (EFS). Also contains lambda function url that is used by the cloudfront module.

`aws/cloudfront`
Contains:
- Certificates: used to request a DNS validated certificate, deploy the required validation records and wait for validation to complete.
- Cloudfront: creates an Cloudfront web distribution and contains HTTP response headers and their values.
- IAM
- Route53
- S3: holds access logs
- WAF: WAFv2 Web ACL resource

`aws/ecr`
Contains the Elastic Container Registry (ECR) Repository, that will hold the docker image

`aws/efs`
Contains resources to allow the storage for and access of the generated privacy statements

`aws/hosted_zone`
Manages Route53 Hosted Zone

`aws/vpc`
Contains the VPC module and ingress and egress rules. It allows the lambda function to be able to access the VPC.


## Architectural Decision Record (ADR)

## Architecture

Use a Docker image based AWS Lambda function to run the App, accessed using a Lambda Function URL. A Cloudfront distribution will then provide a custom URL and caching. Data storage will be provided by EFS.

Using AWS Lambda with Cloudfront provides the following benefits:
1. Highly available and scalable as it is using AWS Lambda.
2. CloudFront will further improve the availability and performance by caching redirect responses and serving responses geographically close to the user.
3. The use of Lambda Function URLs entirely removes the need to manage an API Gateway instance.



![Diagram of Simplify Privacy Statements App](./public/img/Simplify\_Privacy\_app\_ADR.png)