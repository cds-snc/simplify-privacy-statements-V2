const Schema = {
  template: {
    isLength: {
      errorMessage: 'errors.field_empty',
      options: { min: 1, max: 200 },
    },
  },
}

module.exports = {
  Schema,
}
