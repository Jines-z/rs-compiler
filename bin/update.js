const cwd          = process.cwd()
const fs           = require('fs')
const path         = require('path')
const semver       = require('semver')
const request      = require('request')
const cp           = require('child_process')
const chalk        = require('chalk')
const packageJson  = require(`${cwd}/package.json`)
const yarnLock     = fs.existsSync(path.join(cwd, 'yarn.lock'))
const npmLock      = fs.existsSync(path.join(cwd, 'package-lock.json'))

request({ url: 'https://registry.npmjs.org/rs-compiler' }, (err, res, body) => {
    if (!err && res.statusCode === 200) {
        const latest_v = JSON.parse(body)['dist-tags'].latest
        const local_v = packageJson.devDependencies['rs-compiler'].replace(/^\^|@|~/, '')
        if (semver.lt(local_v, latest_v)) {
            if (yarnLock && npmLock) {
                console.log(chalk.red('  Found that \'package-lock.json\' and \'yarn.lock\' exist at the same time, please delete one of them!\n'))
            } else if (yarnLock) {
                console.log('正在更新rs-compiler')
                cp.exec('yarn add rs-compiler@latest --dev')
            } else if (npmLock) {
                console.log('正在更新rs-compiler')
                cp.exec('npm install rs-compiler@latest -D')
            }
        }
    }
})
