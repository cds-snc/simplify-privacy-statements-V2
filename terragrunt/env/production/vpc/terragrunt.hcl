terraform {
    source = "../../../aws//vpc"
}

include {
  path = find_in_parent_folders()
}