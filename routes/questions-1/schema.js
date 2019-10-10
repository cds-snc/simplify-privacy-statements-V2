const Schema = {
  recording_type: {
    custom: {
      options: (value, { req }) => {
        const confidentiality = req.body.confidentiality
        if (
          confidentiality &&
          ['form.anonymized', 'form.anonymous'].includes(confidentiality)
        ) {
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
        if (compensation && compensation === 'Yes') {
          if (value !== 'On paper') {
            return false
          }
        }
        return true
      },
      errorMessage: 'errors.consent',
    },
  },
  researcher_email: {
    custom: {
      options: (value, { req }) => {
        if (value && value.length > 0) {
          if (!(value.endsWith('@cds-snc.ca') || value.endsWith('.gc.ca'))) {
            return false
          }
        }
        return true
      },
      errorMessage: 'errors.researcher_email',
    },
  },
}

module.exports = {
  Schema,
}
