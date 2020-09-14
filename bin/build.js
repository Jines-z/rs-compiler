const cwd     = process.cwd()
const webpack = require('webpack')
const chalk   = require('chalk')
const rimraf  = require('rimraf')
const config  = require('../config/webpack.pro.config')
const project = require(`${cwd}/project.config`)

rimraf(project.outDir, err => {
    if (err) throw err
    webpack(config).run((err, stats) => {
        if (err || stats.hasErrors()) {
            console.log(err || stats.compilation.errors)
            console.log(chalk.red('\n  Webpack compilation failed\n'))
        } else {
            process.stdout.write(stats.toString({
                colors       : true,
                modules      : false,
                children     : false,
                chunks       : false,
                chunkModules : false,
                timings      : false
            }) + '\n\n')
            console.log(`Webpack compiled successfully\n`)
        }
    })
})


