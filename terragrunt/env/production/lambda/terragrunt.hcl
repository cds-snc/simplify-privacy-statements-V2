terraform {
  source = "../../../aws//lambda"
}

dependencies {
  paths = ["../ecr", "../vpc", "../efs"]
}

dependency "ecr" {
  config_path = "../ecr"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs = {
    aws_ecr_repository = ""
  }
}

dependency "vpc" {
  config_path = "../vpc"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs = {
    aws_security_group_ids = ""
    public_subnets_ids = ""
  }
}

dependency "efs" {
  config_path = "../efs"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs = {
    aws_efs_access_point = ""
  }
}

inputs = {
  aws_ecr_repository = dependency.ecr.outputs.aws_ecr_repository
  aws_security_group_ids = dependency.vpc.outputs.aws_security_group_ids
  public_subnets_ids = dependency.vpc.outputs.public_subnets_ids
  aws_efs_access_point = dependency.efs.outputs.aws_efs_access_point
}
include {
  path = find_in_parent_folders()
}