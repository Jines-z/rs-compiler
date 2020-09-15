const cwd          = process.cwd()
const fs           = require('fs')
const path         = require('path')
const semver       = require('semver')
const request      = require('request')
const cp           = require('child_process')
const chalk        = require('chalk')
const packageJson  = require(`${cwd}/package.json`)
const Spinner      = require('../lib/Spinner')
const yarnLock     = fs.existsSync(path.join(cwd, 'yarn.lock'))
const npmLock      = fs.existsSync(path.join(cwd, 'package-lock.json'))

const exec = (cmd, cb) => {
    cp.exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.red(`  Exec error: ${err}`))
            process.exit(0)
        } else {
            Spinner.stop()
            cb()
        }
    })
}

const update = (cb) => {
    Spinner.start('Check the version of \'rs-compiler\'')
    request({ url: 'https://registry.npm.taobao.org/rs-compiler' }, (err, res, body) => {
        if (!err && res.statusCode === 200) {
            const latest_v = JSON.parse(body)['dist-tags'].latest
            const local_v = packageJson.devDependencies['rs-compiler'].replace(/^\^|@|~/, '')
            if (semver.lt(local_v, latest_v)) {
                const text = `Updating \'rs-compiler\' ${chalk.gray(local_v)} ~ ${chalk.green(latest_v)}`
                if (yarnLock && npmLock) {
                    Spinner.stop()
                    console.log(chalk.red('  Found that \'package-lock.json\' and \'yarn.lock\' exist at the same time\n'))
                    process.exit(0)
                } else if (yarnLock) {
                    Spinner.start(text)
                    exec('yarn add rs-compiler@latest --dev', cb)
                } else if (npmLock) {
                    Spinner.start(text)
                    exec('npm install rs-compiler@latest -D', cb)
                } else {
                    Spinner.stop()
                    console.log(`  A new version of ${chalk.cyan('rs-compiler')} has been detected (${chalk.gray(local_v)} ~ ${chalk.green(latest_v)})`)
                    console.log(`  Run ${chalk.cyan('npm install rs-compiler@latest -D')} or ${chalk.cyan('yarn add rs-compiler@latest --dev')} to update\n`)
                    process.exit(0)
                }
            } else {
                Spinner.stop()
                cb()
            }
        } else {
            Spinner.stop()
            console.log(chalk.red('  Request \'NPM\' failed, please try again\n'))
            process.exit(0)
        }
    })
}

module.exports = update
