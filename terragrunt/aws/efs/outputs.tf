output "aws_efs_access_point" {
  description = "Provides and EFS Access Point"
  value       = aws_efs_access_point.efs_access_point.arn
}

output "aws_efs_file_system" {
  description = "Provides an Elastic File System (EFS) File System resource"
  value       = aws_efs_file_system.generated_statement_efs.arn
}