terraform {
  source = "../../../aws//efs"
}

dependencies {
    paths = ["../vpc"]
}

dependency "vpc" {
  config_path = "../vpc"
}

inputs = {
  aws_security_group_ids = dependency.vpc.outputs.aws_security_group
  vpc_public_subnets_ids = dependency.vpc.outputs.public_subnet_ids
}
include {
  path = find_in_parent_folders()
}