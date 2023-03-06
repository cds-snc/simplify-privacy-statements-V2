terraform {
  source = "../../../aws//efs"
}

dependencies {
    paths = ["../vpc"]
}

dependency "vpc" {
  config_path = "../vpc"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs = {
    aws_security_group_ids = ""
    public_subnets_ids = ""
  }
}

inputs = {
  aws_security_group_ids = dependency.vpc.outputs.aws_security_group
  vpc_public_subnets_ids = dependency.vpc.outputs.public_subnet_ids
}
include {
  path = find_in_parent_folders()
}