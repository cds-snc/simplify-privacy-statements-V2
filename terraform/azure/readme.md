# Azure deployment

## 1. Bootstrap - Configure remote state storage

There are a few variables that can be set in a `terraform.tfvars` file - if you don't set them, you will be prompted for them:

- **name**: ServiceName - will be used when creating other resource names
- **location**: Location - ie, canadaeast, canadacentral

Note that it is best to use the same Service Name in both this bootstrap step, and in the deploy infrastructure step.

The name variable will be used to name various resources:

- The Resource Group name will be in the form: `[ServiceName]-remote-state-RG`
- The Storage Account name will be in the form: `[lower(ServiceName)]tfstorage`
- The Storage Container name will be in the form: `[lower(ServiceName)]-remote-state-container`

```sh
cd bootstrap
terraform init
terraform plan
terraform apply
```

Use the output from the above `terraform apply` command to populate `backend.tfvars` in this directory. There is a `backend.tfvars.example` file provided. Required variables:

- **resource_group_name** (ex: MyCDSService-remote-state-RG)
- **storage_account_name** (ex: mycdsservicetfstorage)
- **container_name** (ex: mycdsservice-remote-state-container)
- **key** (ex: terraform.tfstate - this is pretty standard name for this file, probably best to keep it)

## 2. Deploy infrastructure

Configure the following variables in terraform.tfvars (there is an example file included):

- **name** (ex: MyCDSService)
- **docker_image** (ex: mycdsservice/node-app)
- **docker_image_tag** (ex: latest)

Run terraform init with the backend config from previous step:

`terraform init -backend-config=backend.tfvars`

Run terraform plan and confirm the resources to be created.

`terraform plan`

If everything looks good, apply the changes.

`terraform apply`

Your infrastructure should now be running. The previous command will output some information you will need for deploying your container.

## 3. Deploy your container

First, login to your new Azure Container Registry, using the `container_registry_login_server` attribute from the previous step.

`docker login [container_registry_login_server]`

You will enter the `container_registry_admin_username` and `container_registry_admin_password` from the previous step.

Next you need to build/tag and push your container. Do this from the root of this repository.

`docker build --tag [container_registry_login_server]/[docker_image]:latest .`

example: `docker build --tag mycdsservice.azurecr.io/mycdsservice/node-app:latest .`

`docker push [container_registry_login_server]/[docker_image]:[docker_image_tag]`

example: `docker push mycdsservice.azurecr.io/mycdsservice/node-app:latest`

Once you've pushed this image, the app service should pull it in and start up. You can login to Azure and check container logs if things aren't working right.

## 4. Setup autodeploy

After the initial push, the app service won't automatically pull in updated containers. To do this, we must setup a Container Registry webhook. There are scripts in the `autodeploy` folder that facilitate this, but we must manually get the webhook uri from Azure. To start:

1. Login to Azure
2. Find your Resource Group (ex: `MyCDSService-resources-RG`)
3. Find your App Service (ex: `MyCDSService-appservice`)
4. Navigate to `Container settings`
5. Click `show` next to `Webhook URL`
6. Copy the Webhook URL to your clipboard

You will need to configure the following variables in terraform.tfvars (there is an example file included) in the autodeploy folder:

- **resource_group** (ex: "MyCDSService-resources-RG")
- **container_registry** (ex: "MyCDSService")
- **location** (ex: "canadacentral")

Since .tfvars files should generally be committed as part of infrastructure, we recommend that you **not** save the webhook_uri in terraform.tfvars. Instead, run the commands below and you will be prompted to enter the webhook_uri (copied above) as part of the deploy process.

`terraform plan`
`terraform apply`
