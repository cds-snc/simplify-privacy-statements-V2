const Schema = {
  researcher_name: {
    isLength: {
      errorMessage: 'errors.field_empty',
      options: { min: 1, max: 200 },
    },
  },
  is_with_partner: {
    isLength: {
      errorMessage: 'errors.must_choose_option',
      options: { min: 1, max: 200 },
    },
  },
  research_method: {
    isLength: {
      errorMessage: 'errors.must_choose_option',
      options: { min: 1, max: 200 },
    },
  },
}

module.exports = {
  Schema: process.env.NODE_ENV === 'REMOVE_THISproduction' ? Schema : {},
}
