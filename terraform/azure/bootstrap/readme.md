# Bootstrap

**Run these scripts first!**

This will create a ResourceGroup and StorageAccount to be used as a remote state backend.

Variables:

- **name**: ServiceName - will be used when creating other resource names

The Resource Group name will be in the form: `[ServiceName]-remote-state-RG`
The Storage Account name will be in the form: `[lower(ServiceName)]tfstorage`
The Storage Container name will be in the form: `[lower(ServiceName)]-remote-state-container`

Outputs:

- storage-account-name
- resource-group-name
- container-name
- storage_account_id

You will use these outputs in the main .tfvars file.

See: https://github.com/sjones-sot/terraform-azurerm-remote-state-storage