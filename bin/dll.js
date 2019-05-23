const cwd     = process.cwd()
const webpack = require('webpack')
const rimraf  = require('rimraf')
const chalk   = require('chalk')
const config  = require('../config/webpack.dll.config')
const project = require(`${cwd}/project.config`)
const DLL_DIR = project.dllDir

rimraf(DLL_DIR, err => {
    if (err) throw err
    webpack(config).run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(chalk.red('  Webpack compilation failed\n'))
        } else {
            console.log(chalk.green(`  Webpack compiled successfully\n`))
        }
    })
})

