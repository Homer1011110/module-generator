#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')
const path = require('path')

program
    .version('0.1.0')

program
    .command('create-module <name>')
    .alias('cm')
    .description('create a module')
    .option("-c, --conf <config>", "absolute of config file")
    .action(require('./create-module'))

program.parse(process.argv);