resource "aws_wafv2_web_acl" "simplify_privacy_statements_waf" {
  provider = aws.us-east-1

  name        = "simplify_privacy_statements_waf"
  description = "WAF for Simplify Privacy Statements"
  scope       = "CLOUDFRONT"

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesAmazonIpReputationList"
    priority = 10

    override_action {
      none {}
    }


    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "APIRateLimit"
    priority = 20

    action {
      block {}
    }


    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "APIRateLimit"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 30

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesKnownBadInputsRuleSet"
    priority = 40

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"

      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "AWSManagedRulesLinuxRuleSet"
    priority = 50

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesLinuxRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesLinuxRuleSet"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "api"
    sampled_requests_enabled   = false
  }

  rule {
    name     = "APIInvalidPath"
    priority = 5
    action {
      block {}
    }

    statement {
      not_statement {
        statement {
          regex_pattern_set_reference_statement {
            arn = aws_wafv2_regex_pattern_set.valid_uri_paths.arn
            field_to_match {
              uri_path {}
            }
            text_transformation {
              priority = 1
              type     = "COMPRESS_WHITE_SPACE"
            }
            text_transformation {
              priority = 2
              type     = "LOWERCASE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "APIInvalidPaths"
      sampled_requests_enabled   = true
    }
  }
}

resource "aws_cloudwatch_log_group" "simplify_privacy_statements_waf" {
  name              = "/aws/kinesisfirehose/simplify_privacy_statements_waf"
  retention_in_days = 14

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }
}
resource "aws_wafv2_regex_pattern_set" "valid_uri_paths" {
  provider    = aws.us-east-1
  name        = "ValidURIPaths"
  description = "Regex to match the APIs valid URI paths"
  scope       = "CLOUDFRONT"

  # languages
  regular_expression {
    regex_string = "^/(en|fr)$"
  }

  # agreement-1

  regular_expression {
    regex_string = "^/(en/agreement-1|fr/agreement-1)$"
  }

  # downloading agreement
  regular_expression {
    regex_string = "^/access/(agreement-[\\d]{8}.docx)?$"
  }

  # language toggle

  regular_expression {
    regex_string = "^/(en/agreement-1?lang=fr|fr/agreement-1?lang=en)?$"
  }

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }
}

resource "aws_kinesis_firehose_delivery_stream" "simplify_privacy_statements_waf" {
  provider = aws.us-east-1

  name        = "aws-waf-logs-simplify_privacy"
  destination = "extended_s3"

  server_side_encryption {
    enabled = true
  }

  extended_s3_configuration {
    role_arn           = aws_iam_role.waf_log_role.arn
    prefix             = "waf_acl_logs/AWSLogs/${var.account_id}/"
    bucket_arn         = local.cbs_satellite_bucket_arn
    compression_format = "GZIP"

    cloudwatch_logging_options {
      enabled         = true
      log_group_name  = aws_cloudwatch_log_group.simplify_privacy_statements_waf.name
      log_stream_name = "WAFLogS3Delivery"
    }
  }

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }
}

resource "aws_wafv2_web_acl_logging_configuration" "simplify_privacy_statements_waf" {
  provider                = aws.us-east-1
  log_destination_configs = [aws_kinesis_firehose_delivery_stream.simplify_privacy_statements_waf.arn]
  resource_arn            = aws_wafv2_web_acl.simplify_privacy_statements_waf.arn
}