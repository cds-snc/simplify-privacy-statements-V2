# Azure deployment

1. Bootstrap - Configure remote state storage

See the readme in the bootstrap directory for additional details.

```sh
cd bootstrap
terraform init
terraform plan
terraform apply
```

Copy the attributes output from terraform apply to `backend.tfvars` in this directory. There is a backend.tfvars.example file provided.

2. Deploy infrastructure

Configure the following variables in terraform.tfvars (there is an example file included):

- name
- docker_image
- docker_image_tag

Run terraform init with the backend config from previous step:

`terraform init -backend-config=backend.tfvars`

Run terraform plan and confirm the resources to be created.

`terraform plan`

If everything looks good, run terraform apply.

`terraform apply`

Your infrastructure is now setup. The previous command will output some information you will need for deploying your container.

3. Deploy your container

First, login to your new Azure Container Registry, using the `container_registry_login_server` attribute from the previous command:

`docker login [container_registry_login_server]`

You will enter the `container_registry_admin_username` and `container_registry_admin_password` from the previous command.

Next you need to build/tag and push your container. Do this from the root of this repository.

`docker build --tag [container_registry_login_server]/[docker_image]:latest .`

example: `docker build --tag mycdsservice.azurecr.io/mycdsservice/node-app:latest .`

`docker push [container_registry_login_server]/[docker_image]:[docker_image_tag]`

example: `docker push mycdsservice.azurecr.io/mycdsservice/node-app:latest`


4. Setup autodeploy

Autodeploy must be setup separately.