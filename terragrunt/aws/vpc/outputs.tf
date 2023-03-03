output "aws_security_group" {
  value = aws_security_group.efs_access_sg.id
}

output "public_subnets_ids" {
  value = module.vpc.public_subnets_ids
}