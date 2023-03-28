terraform {
  source = "../../../aws//app"
}

dependencies {
  paths = ["../ecr", "../vpc", "../efs"]
}

dependency "ecr" {
  config_path = "../ecr"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs_merge_strategy_with_state  = "shallow"
  mock_outputs = {
    aws_ecr_repository_arn = ""
    aws_ecr_repository_url = ""
  }
}

dependency "vpc" {
  config_path = "../vpc"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs = {
    lambda_aws_security_group_ids = ""
    public_subnets_ids = ""
    private_subnet_ids = []
  }
}

dependency "efs" {
  config_path = "../efs"
  mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
  mock_outputs_merge_strategy_with_state  = "shallow"
  mock_outputs = {
    aws_efs_access_point = ""
    aws_efs_file_system = ""
  }
}

inputs = {
  aws_ecr_repository_arn = dependency.ecr.outputs.aws_ecr_repository_arn
  aws_ecr_repository_url = dependency.ecr.outputs.aws_ecr_repository_url
  lambda_aws_security_group_ids = dependency.vpc.outputs.lambda_aws_security_group_ids
  public_subnets_ids = dependency.vpc.outputs.public_subnets_ids
  private_subnet_ids = dependency.vpc.outputs.private_subnet_ids
  aws_efs_access_point = dependency.efs.outputs.aws_efs_access_point
  aws_efs_file_system = dependency.efs.outputs.aws_efs_file_system
}
include {
  path = find_in_parent_folders()
}