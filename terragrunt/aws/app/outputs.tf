output "aws_lambda_function_url" {
  description = "The HTTP URL endpoint for the function"
  value       = aws_lambda_function_url.generated_statement_url.function_url
}

output "aws_lambda_function_url_name" {
  description = "The name of the Lambda function URL"
  value       = aws_lambda_function_url.generated_statement_url.function_name
}