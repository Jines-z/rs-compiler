const cwd     = process.cwd()
const webpack = require('webpack')
const rimraf  = require('rimraf')
const chalk   = require('chalk')
const config  = require('../config/webpack.dll.config')
const project = require(`${cwd}/project.config`)

rimraf(project.dllDir, err => {
    if (err) throw err
    webpack(config).run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(err || stats.compilation.errors)
            console.log(chalk.red('\n  Webpack compilation failed\n'))
        } else {
            console.log(chalk.green(`  Webpack compiled successfully\n`))
        }
    })
})

