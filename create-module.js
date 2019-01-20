const chalk = require('chalk')
const core = require('./libs/core')
const path = require('path')
const fsPromise = require('fs').promises

module.exports = async (name, options) => {
    try {
        if(!options.conf) {
            return console.log(chalk.red('you need to specify a config file path'))
        }

        const configFilePath = path.resolve(options.conf)
        const configFileDir = path.dirname(configFilePath)
        const tasks = require(configFilePath)(name)
        await Promise.all(tasks.map(async (item) => {
            if(!item.srcFile || !item.destDir) {
                throw 'task item must set srcFile and destDir'
            }

            const srcFile = path.resolve(configFileDir, item.srcFile)
            const destDir = path.resolve(configFileDir, item.destDir)

            let renderOptions = item.renderOptions || {}
            let { renderData={} } = renderOptions
            renderData = { name, ...renderData }
            renderOptions.renderData = renderData

            await fsPromise.mkdir(destDir, { recursive: true })

            await core({
                ...item,
                srcFile,
                destDir,
                renderOptions,
            })
        }))
        console.log(chalk.green('[success] !!!'))
    } catch (e) {
        console.log(chalk.red('[fail] => \n'), e)
    }
}