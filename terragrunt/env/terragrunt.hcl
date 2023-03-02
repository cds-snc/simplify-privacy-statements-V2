generate "provider" {
    path = "provider.tf"
    if_exists = "overwrite"
    contents = file("./common/provider.tf")
}