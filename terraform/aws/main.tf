terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.25.0"
    }
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
  name = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v4"
  build {
    context    = "../../../simplify-privacy-statements-V2/"
    dockerfile = "Dockerfile"
  }
}

module "lambda" {
  source    = "github.com/cds-snc/terraform-modules?ref=v5.0.0//lambda"
  name = "privacy_statement_lambda_function"
  ecr_arn = aws_ecr_repository.privacy-statement-lambda-container.arn
  image_uri     = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v4"
  billing_tag_value = var.billing_code
}
variable "billing_code" {
  description = "The billing code to tag our resources with"
  type        = string
}

resource "aws_lambda_function_url" "js_lambda_docker_function_url" {
  function_name      = module.lambda.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["*"]
  }

}
