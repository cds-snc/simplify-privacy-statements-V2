terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9"
    }
  }
}

provider "aws" {
  alias = "ca-central-1"
  region = "ca-central-1"
}

provider "aws" {
  region              = "ca-central-1"
  allowed_account_ids = [var.account_id]
}