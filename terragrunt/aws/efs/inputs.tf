variable "efs_aws_security_group_ids" {
  description = "AWS security group ID used by the EFS mount target."
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "AWS Private Subnet ID used by the EFS mount target."
  type        = list(string)
}
