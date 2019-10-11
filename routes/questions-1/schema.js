const requiredFor = language => {
  return {
    custom: {
      options: (value, { req }) => {
        if (
          process.env.NODE_ENV !== 'development' &&
          req.body.language === language &&
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
  research_goal_en: requiredFor('_en'),
  research_goal_fr: requiredFor('_fr'),
  session_activity_en: requiredFor('_en'),
  session_activity_fr: requiredFor('_fr'),
  session_duration_en: requiredFor('_en'),
  session_duration_fr: requiredFor('_fr'),
  personal_information_collected_en: requiredFor('_en'),
  personal_information_collected_fr: requiredFor('_fr'),

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
