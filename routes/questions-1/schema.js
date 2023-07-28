const isRequired = () => {
  return {
    custom: {
      options: (value, { req }) => {
        if (
          process.env.NODE_ENV !== 'development' &&
          !(value && value.length > 0)
        ) {
          return false
        }

        return true
      },
      errorMessage: 'errors.requiredField',
    },
  }
}

const Schema = {
  research_goal: isRequired(),
  session_activity: isRequired(),
  session_duration: isRequired(),
  personal_information_collected: isRequired(),

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
        const consent = req.body.consent;
        if (compensation && compensation === 'yes') {
          if (consent !== 'in writing') {
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
          if (!value.endsWith('.gc.ca')) {
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
