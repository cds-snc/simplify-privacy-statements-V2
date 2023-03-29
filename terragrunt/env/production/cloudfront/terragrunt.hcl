terraform {
    source = "../../../aws//cloudfront"
}

dependencies {
    paths = ["../app"]
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

inputs = {
    generated_statement_lambda_function_url = dependency.app.outputs.generated_statement_lambda_function_url
    generated_statement_lambda_function_url_name = dependency.app.outputs.generated_statement_lambda_function_url_name
}

include {
  path = find_in_parent_folders()
}