const chalk = require('chalk')
const { render } = require('../util')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises

module.exports = async (name, options) => {
    try {
        const readRes = await fsPromises.readFile('./package.json', { encoding: 'utf8' })
        let isModuleExist = false
        try {
            await fsPromises.access(`modules/${name}`)
            isModuleExist = true
            console.log(chalk.red(`模块[${name}]已存在`))
            process.exit(1)
        } catch (e) {}
        console.log(chalk.green(`可创建此模块`))
        fsPromises.mkdir(path.resolve(__dirname, `../modules/${name}`))

        const writeRes = await fsPromises.writeFile(`modules/${name}/index.json`, readRes, { flag: 'w' })
        console.log(chalk.green(`创建完成!`))
    } catch(e) {
        console.log(chalk.red('error:'), e)
    }
}