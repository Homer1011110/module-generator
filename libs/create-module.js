const chalk = require('chalk')
const { render } = require('../util')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises

module.exports = async (name, options) => {
    try {
        const destDir = path.resolve(__dirname, `../modules`)
        const tplDir = path.resolve(__dirname, `../tpls`)
        try {
            await fsPromises.access(path.resolve(destDir, name))
            console.log(chalk.red(`模块[${name}]已存在`))
            process.exit(1)
        } catch (e) {}
        const fileName = 'index.js'
        const tplFilePath = path.resolve(tplDir, fileName)
        const tpl = await fsPromises.readFile(tplFilePath, { encoding: 'utf8' })
        const fileData = render(tpl, {name: name})
        const destModulePath = path.resolve(destDir, name)
        await fsPromises.mkdir(destModulePath)
        await fsPromises.writeFile(path.resolve(destModulePath, fileName), fileData, { flag: 'w' })
        console.log(chalk.green(`创建完成!`))
    } catch(e) {
        console.log(chalk.red('error:'), e)
    }
}