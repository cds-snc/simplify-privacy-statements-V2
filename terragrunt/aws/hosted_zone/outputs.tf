output "hosted_zone_id" {
  description = "Route53 hosted zone ID that will hold our DNS records"
  value       = aws_route53_zone.simplify_privacy_statements.zone_id
}

output "hosted_zone_id_fr" {
  description = "Route53 hosted zone ID that will hold our DNS records"
  value       = aws_route53_zone.simplify_privacy_statements_fr.zone_id
}