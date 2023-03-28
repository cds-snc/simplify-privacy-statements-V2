output "public_subnets_ids" {
  description = "AWS Public Subnet ID used by the EFS mount target."
  value       = module.vpc.public_subnet_ids
}

output "private_subnet_ids" {
  description = "AWS Public Subnet ID used by the EFS mount target."
  value       = module.vpc.private_subnet_ids
}

output "lambda_aws_security_group_ids" {
  description = "AWS Lambda security group ID used by the EFS mount target."
  value       = aws_security_group.lambda_access_sg.id
}

output "efs_aws_security_group_ids" {
  description = "AWS EFS security group ID used by the EFS mount target."
  value       = aws_security_group.efs_access_sg.id
}