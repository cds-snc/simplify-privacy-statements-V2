module "generated_statement_lambda" {
    source                 = "github.com/cds-snc/terraform-modules?ref=v5.1.1//lambda"
    name = "generated_statement_lambda_function"
    billing_tag_value      = var.billing_code
    ecr_arn = var.aws_ecr_repository
    # enable_lambda_insights = true
    image_uri = "${var.aws_ecr_repository}:latest"
    # timeout = 30
    
    # vpc = {
    #     security_group_id = [var.aws_security_group_ids]
    #     subnet_ids = var.public_subnets_ids
    # }

    # environment_variables = {
    #     BINARY_CONTENT_TYPES = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    # }

    # file_system_config = {
    #     arn = var.aws_efs_access_point
    #     local_mount_path = "/mnt/access"
    # }

}

# resource "aws_lambda_function_url" "generated_statement_url" {
#     function_name = module.generated_statement_lambda.function_name
#     authorization_type = "NONE"

#     cors {
#         allow_credentials = true
#         allow_origins = ["*"]
#         allow_methods = ["*"]
#         max_age = 86400
#     }
# }