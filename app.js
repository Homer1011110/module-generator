#!/usr/bin/env node

const chalk = require('chalk')
const program = require('commander')

program
    .version('0.1.0')
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');

program
    .command('create-module <name>')
    .alias('cm')
    .description('create a module')
    .option("-e, --exec_mode <mode>", "Which exec mode to use")
    .action(require('./libs/create-module'))

program.parse(process.argv);