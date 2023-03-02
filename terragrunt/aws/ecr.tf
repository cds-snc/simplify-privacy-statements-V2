resource "aws_ecr_repository" "privacy_statement_container" {
  name                 = "privacy-statement-container"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}