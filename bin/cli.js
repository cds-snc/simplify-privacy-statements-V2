#!/usr/bin/env node
var _routesConfig = require('../config/routes.config.js')

const commander = require('commander')
const program = new commander.Command()
program.version('0.0.1')

program.option('routes', 'Prints out all the routes')

program.parse(process.argv)

if (program.routes) {
  console.log(_routesConfig.routes)
}
