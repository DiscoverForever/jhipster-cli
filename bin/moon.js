#!/usr/bin/env node

require('commander')
.version(require('../package').version)
.usage('<command> [options]')
.command('init', 'generate a new project from config')
.command('export', 'export database as markdown or excel from leancloud')
.command('generate', 'generate somthing')

.parse(process.argv)