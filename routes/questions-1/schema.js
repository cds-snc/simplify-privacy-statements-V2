const Schema = {
  recording_type: {
    custom: {
      options: (value, { req }) => {
        const confidentiality = req.body.confidentiality
        if (confidentiality && ['form.anonymized', 'form.anonymous'].includes(confidentiality)) {
          if (value === 'Video and audio') {
            return false
          }
        }
        return true
      },
      errorMessage: 'errors.recording_type',
    },
  },
  consent: {
    custom: {
      options: (value, { req }) => {
        const compensation = req.body.compensation
        if (compensation && compensation === "Yes") {
          if (value !== 'On paper') {
            return false
          }
        }
        return true
      },
      errorMessage: 'errors.consent',
    },
  },
}

module.exports = {
  Schema,
}
