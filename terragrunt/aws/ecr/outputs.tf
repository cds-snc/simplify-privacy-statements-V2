output "aws_ecr_repository" {
  value = aws_ecr_repository.privacy_statement_container.repository_url
}