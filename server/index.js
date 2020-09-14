const cwd                  = process.cwd()
const express              = require('express')
const webpack              = require('webpack')
const opn                  = require('opn')
const address              = require('address')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compress             = require('compression')
const proxyMiddleware      = require('../lib/Http-Proxy-Middleware')
const clearCMD             = require('../lib/ClearCMD')
const webpackConfig        = require('../config/webpack.dev.config')
const project              = require(`${cwd}/project.config`)

const COMPILER    = webpack(webpackConfig)
const APP         = express()
const PORT        = project.port
const HOST        = project.host
const PROXY       = project.proxy
const OPEN        = project.open

APP.use(compress())

COMPILER.hooks.done.tap('rs-compiler', () => {
    clearCMD()
})

const devMiddleware = webpackDevMiddleware(COMPILER, {
    headers : {'Access-Control-Allow-Origin': '*'},
    stats   : 'errors-warnings'
})

devMiddleware.waitUntilValid(() => {
    let host = ''
    if (HOST === '0.0.0.0') {
        try {
            host = address.ip()
        } catch (e) {
            host = 'localhost'
        }
    } else {
        host = HOST || 'localhost'
    }
    if (OPEN) {
        opn(`http://${host}:${PORT}`)
    }
    COMPILER.hooks.watchRun.tap('rs-compiler', () => {
        clearCMD()
    })
    process.send && process.send('wdm-cb')
})

const hotMiddleware = webpackHotMiddleware(COMPILER, {
    path : '/__webpack_hmr',
    log  : false
})

if (PROXY) {
    for (let x in PROXY) {
        APP.use(new proxyMiddleware(x, PROXY[x]))
    }
}

APP.use(devMiddleware)
APP.use(hotMiddleware)
APP.use(express.static(project.basePath))

module.exports = {
    APP,
    PORT,
    HOST
}
