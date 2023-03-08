output "aws_efs_access_point" {
  description = "Provides and EFS Access Point"
  value = aws_efs_access_point.efs_access_point.arn
}