terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.25.0"
    }
  }
}

resource "aws_iam_role" "iam_for_privacy_statement_lambda" {
  name = "iam_for_privacy_statement_lambda"
  assume_role_policy = data.aws_iam_policy_document.privacy_statement_lambda_document.json
}

data "aws_iam_policy_document" "privacy_statement_lambda_document" {
    statement {
    effect = "Allow"


    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_ecr_repository" "privacy-statement-lambda-container" {
  name                 = "privacy-statement-lambda-container"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "docker_registry_image" "js-lambda-image-docker" {
  name = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v5"
  build {
    context    = "../../../simplify-privacy-statements-V2/"
    dockerfile = "Dockerfile"
  }
}

resource "aws_lambda_function" "privacy_statement_lambda_function" {
  function_name = "privacy_statement_lambda_function"
  image_uri     = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v5"
  role          = aws_iam_role.iam_for_privacy_statement_lambda.arn
  package_type  = "Image"
  //depends
}

resource "aws_lambda_function_url" "js_lambda_docker_function_url" {
  function_name      = aws_lambda_function.privacy_statement_lambda_function.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["*"]
  }

}