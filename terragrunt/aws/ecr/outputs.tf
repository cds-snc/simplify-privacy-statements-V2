output "aws_ecr_repository_arn" {
  value = aws_ecr_repository.privacy_statement_container.arn
}

output "aws_ecr_repository_url" {
  value = aws_ecr_repository.privacy_statement_container.repository_url
}