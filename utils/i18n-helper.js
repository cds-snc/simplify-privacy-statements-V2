/* eslint-disable security/detect-object-injection */
const fs = require('fs')
var readline = require('readline')

console.log(
  '==============================================\n\n' +
    'This outputs the lines of locale/en.json in a form that you can paste into your favourite tranlation site\n\n',
)

function getJSON(path) {
  try {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return JSON.parse(fs.readFileSync(path))
  } catch (e) {
    return {}
  }
}

const i18n = {
  fr: getJSON('locales/fr.json'),
  en: getJSON('locales/en.json'),
}

let translationsNeeded = []
Object.entries(i18n.en).map(([key, value]) => {
  if (Object.keys(i18n.fr).indexOf(key) === -1) {
    // console.log(`${key} -> ${value}`)
    translationsNeeded = translationsNeeded.concat([{ key, value }])
  }
})

const runAgain = translationsNeeded.length > 100
translationsNeeded = translationsNeeded.slice(0, 100)
translationsNeeded.forEach(tn => console.log(tn.value))

console.log('\nNow paste the output of, for example, DeepL\n')

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
})

let translationIndex = 0
rl.on('line', function(line) {
  const tn = translationsNeeded[translationIndex]
  tn.value = line
  translationIndex++
  if (translationIndex === translationsNeeded.length) {
    console.log('\nPaste into locales/fr.json:\n')
    console.log(
      translationsNeeded.map(tn => `"${tn.key}": "${tn.value}"`).join(',\n'),
    )
    if (runAgain) {
      console.log(
        '\n\nAfter pasting run this again to translate remaining lines\n',
      )
    }
    process.exit(0)
  }
})
