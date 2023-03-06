module "vpc" {
  source            = "github.com/cds-snc/terraform-modules?ref=v5.1.0//vpc"
  name              = "simplify-privacy-statements-vpc"
  billing_tag_value = "CostCentre"
  high_availability = true
  enable_flow_log   = true
  block_ssh         = true
  block_rdp         = true

  allow_https_request_out          = true
  allow_https_request_out_response = true
  allow_https_request_in           = true
  allow_https_request_in_response  = true
  single_nat_gateway               = true

}

resource "aws_security_group" "efs_access_sg" {
  name        = "efs_access_sg"
  description = "SG for Lambda"
  vpc_id      = module.vpc.vpc_id
}

resource "aws_security_group_rule" "efs_ingress" {
  description       = "Enables inbound traffic to the Network File System"
  type              = "ingress"
  security_group_id = aws_security_group.efs_access_sg.id
  from_port         = 2049
  to_port           = 2049
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}

resource "aws_security_group_rule" "efs_egress" {
  description       = "Enables inbound traffic to the Network File System"
  type              = "egress"
  security_group_id = aws_security_group.efs_access_sg.id
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
}