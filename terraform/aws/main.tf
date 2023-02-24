terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "2.25.0"
    }
  }
}

resource "aws_ecr_repository" "privacy-statement-lambda-container" {
  name                 = "privacy-statement-lambda-container"
  image_tag_mutability = "MUTABLE"
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "docker_registry_image" "js-lambda-image-docker" {
  name = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v1"
  build {
    context    = "../../../simplify-privacy-statements-V2/"
    dockerfile = "Dockerfile"
  }
}

# module "lambda" {
#   source    = "github.com/cds-snc/terraform-modules?ref=v5.0.0//lambda"
#   name = "privacy_statement_lambda_function"
#   ecr_arn = aws_ecr_repository.privacy-statement-lambda-container.arn
#   image_uri     = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v2"
#   billing_tag_value = var.billing_code
# }
# variable "billing_code" {
#   description = "The billing code to tag our resources with"
#   type        = string
# }

# resource "aws_lambda_function_url" "js_lambda_docker_function_url" {
#   function_name      = module.lambda.function_name
#   authorization_type = "NONE"

#   cors {
#     allow_credentials = false
#     allow_origins     = ["*"]
#     allow_methods     = ["*"]
#   }

# }







//EFS CODE


# ======LAMDA-LAYER======
resource "aws_lambda_function" "privacy_statement_lambda_function" {
  function_name = "privacy_statement_lambda_function"
  image_uri     = "${aws_ecr_repository.privacy-statement-lambda-container.repository_url}:v1"
  role          = aws_iam_role.lambda_efs.arn
  package_type  = "Image"
  timeout       = 30 # Give pandoc time to generate the file

  # Let serverless-http know that it should base64 the docx file before streaming the response
  # https://github.com/dougmoscrop/serverless-http/blob/master/docs/ADVANCED.md#binary-mode
  environment {
    variables = {
      BINARY_CONTENT_TYPES = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    }
  }

  file_system_config {
    arn = aws_efs_access_point.efs_access_point.arn
    local_mount_path = "/mnt/access"
  }
    vpc_config {
    
    
    # subnet_ids         = [aws_subnet.efs_public[0].id,aws_subnet.efs_public[1].id]
    subnet_ids = [ aws_subnet.efs_public.id ]
    security_group_ids = [aws_security_group.efs_access_sg.id]
  }
  depends_on = [aws_efs_mount_target.efs_mount]
}

resource "aws_lambda_function_url" "js_lambda_docker_function_url" {
  function_name      = aws_lambda_function.privacy_statement_lambda_function.function_name
  authorization_type = "NONE"

  cors {
    allow_credentials = false
    allow_origins     = ["*"]
    allow_methods     = ["*"]
  }

}

#======EFS======
resource "aws_efs_file_system" "efs_example" {
   creation_token = "efs-example"
   performance_mode = "generalPurpose"
   throughput_mode = "bursting"
   encrypted  = "true"
  
   tags = {
    Environment = var.environment
    Team        = "Network"
    Name        = "efsExample"
  }
 }

 resource "aws_efs_mount_target" "efs_mount" {

  # count        = length(slice(local.az_names, 0, 2))  
  file_system_id = aws_efs_file_system.efs_example.id
  # subnet_id      = aws_subnet.efs_public[count.index].id
  subnet_id = aws_subnet.efs_public.id
  security_groups = ["${aws_security_group.efs_access_sg.id}"]
}

output "mount_target_dns_name" {
  value = aws_efs_mount_target.efs_mount.mount_target_dns_name
}

resource "aws_efs_access_point" "efs_access_point" {
    
  file_system_id = aws_efs_file_system.efs_example.id

  posix_user {
    gid = 1000
    uid = 1000
  }  

  root_directory {
      path = "/access"

      creation_info {
          owner_gid   = 1000
          owner_uid   = 1000
          permissions = "777"
      }
  }
 
}


resource "aws_efs_file_system_policy" "policy" {
  file_system_id = aws_efs_file_system.efs_example.id

  bypass_policy_lockout_safety_check = true

  policy = <<POLICY
{
    "Version": "2012-10-17",
    "Id": "ExamplePolicy01",
    "Statement": [
        {
            "Sid": "ExampleStatement01",
            "Effect": "Allow",
            "Principal": {
                "AWS": "*"
            },
            "Resource": "${aws_efs_file_system.efs_example.arn}",
            "Action": [
                "elasticfilesystem:ClientMount",
                "elasticfilesystem:ClientWrite",
                "elasticfilesystem:ClientRootAccess"
            ],
            "Condition": {
                "Bool": {
                    "aws:SecureTransport": "true"
                }
            }
        }
    ]
}
POLICY
}

#======IAM======
data "aws_iam_policy" "lambda_execute" {
  arn = "arn:aws:iam::aws:policy/AWSLambdaExecute"
}

data "aws_iam_policy" "lambda_vpc" {
  arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

data "aws_iam_policy" "efs_full_access" {
  arn = "arn:aws:iam::aws:policy/AmazonElasticFileSystemFullAccess"
}

#========lambda-iam-role-creation========

resource "aws_iam_role" "lambda_efs" {
  name               = "${var.environment}-lambdaEFS"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

#=========aws managed policy attach to iam-role======

resource "aws_iam_role_policy_attachment" "lambda_execute_policy" {
  role = aws_iam_role.lambda_efs.name

  policy_arn = data.aws_iam_policy.lambda_execute.arn
}

resource "aws_iam_role_policy_attachment" "lambda_vpc_policy" {
  role = aws_iam_role.lambda_efs.name

  policy_arn = data.aws_iam_policy.lambda_vpc.arn
}

resource "aws_iam_role_policy_attachment" "lambda_efs_full_policy" {
  role = aws_iam_role.lambda_efs.name

  policy_arn = data.aws_iam_policy.efs_full_access.arn
}


#======VPC======
data "aws_availability_zones" "azs" {
    state = "available"
}

locals {
  az_names       = data.aws_availability_zones.azs.names
  public_sub_ids = aws_subnet.efs_public.*.id
}


resource "aws_vpc" "efsvpc" {
  cidr_block           = var.cidr_block
  enable_dns_hostnames = true
  enable_dns_support   = true
  tags = {
    Environment = var.environment
    Team        = "Network"
    Name        = "EFSVPC"
  }
}
resource "aws_internet_gateway" "efs_igw" {
  vpc_id = aws_vpc.efsvpc.id
  tags = {
    Environment = var.environment
    Team        = "Network"
    Name        = "EFSGW"
  }
}
resource "aws_subnet" "efs_public" {

  # count                   = length(slice(local.az_names, 0, 2))
  vpc_id                  = aws_vpc.efsvpc.id
  # availability_zone       = local.az_names[count.index]
  availability_zone = "ca-central-1a"
  # cidr_block              = cidrsubnet(var.cidr_block, 4, count.index)
  cidr_block = "10.10.0.0/16"
  map_public_ip_on_launch = true
  
  tags = {
    Environment = var.environment
    Team        = "Network"
    Name        = "EFSPUBSUBNET"
  }
}

resource "aws_route_table" "efs_publicrt" {
  vpc_id = aws_vpc.efsvpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.efs_igw.id
  }

  
  tags = {
    Environment = var.environment
    Team        = "Network"
    Name        = "efs-public-subnet"
  }
}


resource "aws_route_table_association" "efs_pub_subnet_association" {
  # count          = length(slice(local.az_names, 0, 2))
  # subnet_id      = aws_subnet.efs_public.*.id[count.index]
  subnet_id      = aws_subnet.efs_public.id
  route_table_id = aws_route_table.efs_publicrt.id
}


#===========security group for efs==========

resource "aws_security_group" "efs_access_sg" {
  name        = "efs_access_sg"
  description = "EFS Access Group"
  vpc_id      = aws_vpc.efsvpc.id

  ingress {
    from_port   = 2049
    to_port     = 2049
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

output "access_point" {
  value = aws_efs_access_point.efs_access_point.arn
}
output "path" {
  value = aws_efs_access_point.efs_access_point.root_directory[0].path
}



data "archive_file" "lambda_hello_world" {
    type = "zip"
    source_dir = "../../hello-world/"
    output_path = "${path.module}/hello-world.zip"
}