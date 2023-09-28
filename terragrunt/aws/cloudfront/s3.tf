module "log_bucket" {
  source            = "github.com/cds-snc/terraform-modules?ref=v5.1.11"
  bucket_name       = "${var.product_name}-${var.env}-logs"
  billing_tag_value = var.billing_code
}