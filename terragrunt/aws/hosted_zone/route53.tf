resource "aws_route53_zone" "simplify_privacy_statements" {
  name = var.domain

  tags = {
    CostCentre = var.billing_code
    Terraform  = true
  }
}