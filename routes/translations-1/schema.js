// make first letter lowercase and delete trailing periods
const cleanString = s =>
  s && s.length > 0 ? (s[0].toLowerCase() + s.slice(1)).replace(/\.+$/, '') : s

const stringCleaningValidation = key => {
  return {
    custom: {
      options: (value, { req }) => {
        req.body[`${key}`] = cleanString(value)
        return true
      },
    },
  }
}

const Schema = {
  research_goal_en: stringCleaningValidation('research_goal_en'),
  research_goal_fr: stringCleaningValidation('research_goal_fr'),
  session_activity_en: stringCleaningValidation('session_activity_en'),
  session_activity_fr: stringCleaningValidation('session_activity_fr'),
  session_duration_en: stringCleaningValidation('session_duration_en'),
  session_duration_fr: stringCleaningValidation('session_duration_fr'),
  personal_information_collected_en: stringCleaningValidation(
    'personal_information_collected_en',
  ),
  personal_information_collected_fr: stringCleaningValidation(
    'personal_information_collected_fr',
  ),
  personal_information_disclosed_to_public_en: stringCleaningValidation(
    'personal_information_disclosed_to_public_en',
  ),
  personal_information_disclosed_to_public_fr: stringCleaningValidation(
    'personal_information_disclosed_to_public_fr',
  ),
  administrative_purpose_en: stringCleaningValidation(
    'administrative_purpose_en',
  ),
  administrative_purpose_fr: stringCleaningValidation(
    'administrative_purpose_fr',
  ),
  purposes_for_which_the_recording_may_be_disclosed_en: stringCleaningValidation(
    'purposes_for_which_the_recording_may_be_disclosed_en',
  ),
  purposes_for_which_the_recording_may_be_disclosed_fr: stringCleaningValidation(
    'purposes_for_which_the_recording_may_be_disclosed_fr',
  ),
}

module.exports = {
  Schema,
}
