variable "region" {
  description = "AWS Region resource is created in"
  type        = string
  default     = "ca-central-1"
}
variable "environment"{
    type = string
    default = "test"
}

variable "cidr_block"{
    type = string
    default = "10.10.0.0/16"
}