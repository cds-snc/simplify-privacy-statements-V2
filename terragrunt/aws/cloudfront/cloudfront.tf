resource "aws_cloudfront_distribution" "simplify_privacy_app_cf_distribution" {
  enabled     = true
  aliases     = [var.domain]
  price_class = "PriceClass_100"
  web_acl_id  = aws_wafv2_web_acl.api_waf.arn

  origin {
    domain_name = split("/", var.generated_statement_lambda_function_url)[2]
    origin_id   = var.generated_statement_lambda_function_url_name

    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_read_timeout    = 60
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  default_cache_behavior {
    allowed_methods = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods  = ["GET", "HEAD"]

    forwarded_values {
      query_string = true
      headers      = ["Authorization"]

      cookies {
        forward = "none"
      }
    }

    target_origin_id           = var.generated_statement_lambda_function_url_name
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.simplify_privacy_app_headers_policy.id
  }

  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    minimum_protocol_version       = "TLSv1.2_2021"
  }

  logging_config {
    include_cookies = false
    bucket          = module.log_bucket.s3_bucket_domain_name
    prefix          = "cloudfront"
  }
  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }
}

resource "aws_cloudfront_response_headers_policy" "simplify_privacy_app_headers_policy" {
  name = "simplify-privacy-app-headers"

  security_headers_config {
    frame_options {
      frame_option = "DENY"
      override     = true
    }
    content_type_options {
      override = true
    }
    content_security_policy {
      content_security_policy = "script-src 'self', 'unsafe-inline', 'cdnjs.cloudflare.com', 'https://www.googletagmanager.com', 'https://www.google-analytics.com'; default-src 'self'; base-uri 'none'; font-src 'self', 'https://fonts.gstatic.com'; img-src 'self', 'data:', 'https://www.google-analytics.com'; style-src 'self', 'https://fonts.googleapis.com', 'unsafe-inline'; upgrade-insecure-requests 'true'"
      override                = false
    }

    referrer_policy {
      override        = true
      referrer_policy = "same-origin"
    }

    strict_transport_security {
      override                   = true
      access_control_max_age_sec = 31536000
      include_subdomains         = true
      preload                    = true

    }
    xss_protection {
      override   = true
      mode_block = true
      protection = true
    }
  }
}