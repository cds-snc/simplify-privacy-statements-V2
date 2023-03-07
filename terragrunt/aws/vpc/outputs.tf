output "aws_security_group_ids" {
  description = "AWS security group ID used by the EFS mount target."
  value       = aws_security_group.efs_access_sg.id
}

output "public_subnets_ids" {
  description = "AWS Public Subnet ID used by the EFS mount target."
  value       = module.vpc.public_subnet_ids
}