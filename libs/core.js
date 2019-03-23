const chalk = require('chalk')
const { render } = require('../util')
const errors = require('./errors')
const path = require('path')
const fs = require('fs')
const fsPromises = fs.promises

async function exist(filePath) {
    try {
        await fsPromises.access(filePath)
        return true
    } catch (e) {
        return false
    }
}

async function processFile(filePath, destDir, { disableRender=false, renderData={} }=renderOptions) {
    const fileName = path.basename(filePath)
    const destFilePath = path.resolve(destDir, fileName)
    const isDestFileExist = await exist(destFilePath)
    if(isDestFileExist) {
        console.log(chalk.red(`文件[${destFilePath}]已存在`))
        throw errors.DESTFILE_EXIST
    }

    let fileData = await fsPromises.readFile(filePath, { encoding: 'utf8' })

    if(!disableRender) {
        fileData = render(fileData, renderData)
    }

    await fsPromises.writeFile(destFilePath, fileData, { flag: 'w' })
}

async function processDirectory(srcDir, destDir, renderOptions={}) {
    const fileNames = await fsPromises.readdir(srcDir)
    await Promise.all(fileNames.map(async (fileName) => {
        const srcFilePath = path.resolve(srcDir, fileName)
        let srcFileStat
        try {
            srcFileStat = await fsPromises.stat(srcFilePath)
        } catch (e) { throw errors.SRCFILE_NOT_FOUND }

        if(srcFileStat.isFile()) {
            await processFile(srcFilePath, destDir, renderOptions)
        } else if(srcFileStat.isDirectory()) {
            const subDestDir = path.resolve(destDir, fileName)
            try {
                await fsPromises.mkdir(subDestDir)
            } catch(e) {}

            await processDirectory(
                srcFilePath,
                subDestDir,
                renderOptions
            )
        } else {
            console.log(chalk.red('src file is not a file or directory'), srcFileStat)
        }
    }))
}

module.exports = async ({ srcFile, destDir, renderOptions }) => {
    try {
        if(!path.isAbsolute(srcFile)) {
            throw errors.SRCFILE_INVALID
        }

        if(!path.isAbsolute(destDir)) {
            throw errors.DESTDIR_INVALID
        }

        let destDirStat
        try {
            destDirStat = await fsPromises.stat(destDir)
        } catch (e) { throw errors.DESTDIR_NOT_FOUND }

        if(!destDirStat.isDirectory()) {
            throw errors.DESTDIR_IS_NOT_DIR
        }

        let srcFileStat
        try {
            srcFileStat = await fsPromises.stat(srcFile)
        } catch (e) { throw errors.SRCFILE_NOT_FOUND }

        if(srcFileStat.isFile()) {
            await processFile(srcFile, destDir, renderOptions)
        } else if(srcFileStat.isDirectory()) {
            await processDirectory(srcFile, destDir, renderOptions)
        } else {
            console.log(chalk.red('src file is not a file or directory'), srcFileStat)
        }

    } catch(e) {
        console.log(chalk.red('error:'), e)
        throw e
    }
}