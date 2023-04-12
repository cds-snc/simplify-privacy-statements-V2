module "generated_statement_lambda" {
  source                 = "github.com/cds-snc/terraform-modules?ref=v5.1.1//lambda"
  name                   = "generated_statement_lambda_function"
  billing_tag_value      = var.billing_code
  ecr_arn                = var.aws_ecr_repository_arn
  enable_lambda_insights = true
  image_uri              = "${var.aws_ecr_repository_url}:latest"
  timeout                = 30

  vpc = {
    security_group_ids = [var.lambda_aws_security_group_ids]
    subnet_ids         = var.private_subnet_ids
  }

  environment_variables = {
    BINARY_CONTENT_TYPES = "application/vnd.openxmlformats-officedocument.wordprocessingml.document, image/*"
  }

  file_system_config = {
    arn              = var.aws_efs_access_point
    local_mount_path = "/mnt/access"
  }

  policies = [
    data.aws_iam_policy_document.lambda_efs_access.json
  ]

}

resource "aws_lambda_function_url" "generated_statement_url" {
  function_name      = module.generated_statement_lambda.function_name
  authorization_type = "NONE"
}

data "aws_iam_policy_document" "lambda_efs_access" {

  statement {
    effect = "Allow"
    actions = [
      "elasticfilesystem:ClientWrite",
      "elasticfilesystem:ClientMount",
      "elasticfilesystem:DescribeMountTargets",
      "elasticfilesystem:ClientRootAccess"
    ]
    resources = [
      var.aws_efs_file_system
    ]
  }
}