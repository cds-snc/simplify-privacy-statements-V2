output "aws_security_group" {
  value = aws_security_group.efs_access_sg.id
}

output "public_subnet_ids" {
  value = module.vpc.public_subnet_ids
}