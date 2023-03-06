resource "aws_efs_file_system" "generated_statement_efs" {
  creation_token   = "generated-statement-efs"
  performance_mode = "generalPurpose"
  throughput_mode  = "bursting" # throughput that scales with the amount of storage in your file system https://docs.aws.amazon.com/efs/latest/ug/performance.html#bursting
  encrypted        = true
}

resource "aws_efs_mount_target" "efs_mount" {
  file_system_id  = aws_efs_file_system.generated_statement_efs.id
  subnet_id       = var.public_subnets_ids
  security_groups = ["${var.aws_security_group_ids}"]
}

resource "aws_efs_access_point" "efs_access_point" {
  file_system_id = aws_efs_file_system.generated_statement_efs.id

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

data "aws_iam_policy_document" "efs_policy" {
  statement {
    sid    = "EFSPolicy"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = ["*"]
    }

    actions = [
      "elasticfilesystem:ClientMount",
      "elasticfilesystem:ClientWrite",
      "elasticfilesystem:ClientRootAccess"
    ]

    resources = [aws_efs_file_system.generated_statement_efs.arn]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["true"]
    }
  }
}

resource "aws_efs_file_system_policy" "policy" {
  file_system_id                     = aws_efs_file_system.generated_statement_efs.id
  bypass_policy_lockout_safety_check = true
  policy                             = data.aws_iam_policy_document.efs_policy.json
}