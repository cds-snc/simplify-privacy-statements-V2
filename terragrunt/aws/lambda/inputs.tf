variable "aws_ecr_repository" {
    description = "aws_ecr_repository"
    type = string
}
variable "aws_security_group_ids" {
  description = "AWS security group ID used by the EFS mount target."
  type        = string
}

variable "public_subnets_ids" {
  description = "AWS Public Subnet ID used by the EFS mount target."
  type        = string
}

variable "aws_efs_access_point" {
    description = "aws_efs_access_point"
    type = "string"
}
