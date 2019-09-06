output "storage-account-name" {
  value = "${azurerm_storage_account.remote_state_sa.name}"
}

output "resource-group-name" {
  value = "${azurerm_resource_group.resource_group.name}"
}

output "container-name" {
  value = "${azurerm_storage_container.terraform_remote_state_container.name}"
}

output "storage-account-id" {
  value = "${azurerm_storage_account.remote_state_sa.id}"
}

output "access-key" {
  value = "${azurerm_storage_account.remote_state_sa.primary_access_key}"
}
