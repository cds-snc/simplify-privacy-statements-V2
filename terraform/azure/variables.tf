variable "name" {
  description = "(Required) Specify the Service Name."
}

variable "location" {
  description = "(Required) Specify the location for these resources. Changing this forces a new resource to be created."
  default     = "canadacentral"
}

variable "docker_image" {
  description = "(Required) Specify the name of the container to be deployed"
}

variable "docker_image_tag" {
  description = "(Optional) Specify the tag to be deployed"
}

#variable "subscription_id" {
#  description = "Azure Subscription ID to be used for billing"
#}

#variable "my_sql_master_password" {
#  description = "MySql master password"
#}

#variable "docker_image" {
#  description = "Docker image name"
#}

#variable "docker_image_tag" {
#  description = "Docker image tag"
#}
