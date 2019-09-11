const path = require('path')
const { clientJsDir, getClientJsPath } = require('./url.helpers')

const getClientJs = (req, routeName) => {
  const fs = require('fs')
  const content = fs.readFileSync(
    path.join(__dirname, `../public${clientJsDir}_filelist.json`),
  )
  const json = JSON.parse(content)
  const file = json[routeName]
  return `${getClientJsPath(req)}${file}`
}

module.exports = {
  getClientJs,
}
