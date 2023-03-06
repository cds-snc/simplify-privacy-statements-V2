module "generated_statement_lambda" {
    source                 = "github.com/cds-snc/terraform-modules?ref=v0.0.45//lambda"
    name = "generated_statement_lambda_function"
    billing_tag_value      = var.billing_code
    # ecr_arn = 

}