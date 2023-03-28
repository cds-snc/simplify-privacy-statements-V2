variable "aws_ecr_repository_arn" {
  description = "Full ARN of the repository containing the image"
  type        = string
}
variable "aws_ecr_repository_url" {
  description = "The URL of the repository"
  type        = string
}
variable "lambda_aws_security_group_ids" {
  description = "AWS security group ID used by the Lambda function target."
  type        = string
}

variable "public_subnets_ids" {
  description = "AWS Public Subnet ID used by the EFS mount target."
  type        = list(string)
}

variable "private_subnet_ids" {
  description = "AWS Private Subnet ID used by the EFS mount target."
  type        = list(string)
}

variable "aws_efs_access_point" {
  description = "Provides and EFS Access Point"
  type        = string
}

variable "aws_efs_file_system" {
  description = "Provides an Elastic File System (EFS) File System resource"
  type        = string
}