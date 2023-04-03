variable "generated_statement_lambda_function_url" {
  description = "The HTTP URL endpoint for the function"
  type        = string
}


variable "generated_statement_lambda_function_url_name" {
  description = "The name of the Lambda function URL"
  type        = string
}

variable "hosted_zone_id" {
  description = "The hosted zone ID that holds our DNS records"
  type        = string
}