module "vpc" {
  source            = "github.com/cds-snc/terraform-modules?ref=v0.0.46//vpc"
  name              = "efs-vpc"
  billing_tag_value = "CostCentre"
  high_availability = true
  enable_flow_log   = true
  block_ssh         = true
  block_rdp         = true

  allow_https_request_out          = true
  allow_https_request_out_response = true
  allow_https_request_in           = true
  allow_https_request_in_response  = true

}

resource "aws_security_group" "efs_access_sg" {
  name        = "efs_access_sg"
  description = "SG for Lambda"
  vpc_id      = module.vpc.vpc_id

  ingress {
    description = "Enables inbound traffic to the Network File System"
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    description = "Allow outbound connections"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]

  }
}