terraform {
    source = "../../../aws//cloudfront"
}

dependencies {
    paths = ["../app", "../hosted_zone"]
}

dependency "app" {
    config_path = "../app"
    mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
    mock_outputs_merge_strategy_with_state  = "shallow"
    mock_outputs = {
        generated_statement_lambda_function_url = ""
        generated_statement_lambda_function_url_name = ""
    }
}

dependency "hosted_zone" {
    config_path = "../hosted_zone"
    mock_outputs_allowed_terraform_commands = ["init", "fmt", "validate", "plan", "show"]
    mock_outputs_merge_strategy_with_state  = "shallow"
    mock_outputs = {
        hosted_zone_id = ""
    }
}

inputs = {
    generated_statement_lambda_function_url = dependency.app.outputs.generated_statement_lambda_function_url
    generated_statement_lambda_function_url_name = dependency.app.outputs.generated_statement_lambda_function_url_name
    hosted_zone_id = dependency.hosted_zone.outputs.hosted_zone_id
}

include {
  path = find_in_parent_folders()
}