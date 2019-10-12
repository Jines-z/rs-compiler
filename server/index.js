const cwd                  = process.cwd()
const express              = require('express')
const webpack              = require('webpack')
const opn                  = require('opn')
const address              = require('address')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compress             = require('compression')
const proxy                = require('../lib/Proxy')
const webpackConfig        = require('../config/webpack.dev.config')
const project              = require(`${cwd}/project.config`)

const COMPILER    = webpack(webpackConfig)
const APP         = express()
const PORT        = project.port
const HOST        = project.host
const PROXY_TABLE = project.proxy

APP.use(compress())

const devMiddleware = webpackDevMiddleware(COMPILER, {
    headers : {'Access-Control-Allow-Origin': '*'},
    stats   : 'errors-warnings',
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

    opn(`http://${host}:${PORT}`)
})

const hotMiddleware = webpackHotMiddleware(COMPILER, {
    path : '/__webpack_hmr',
    log  : false
})

for (let x in PROXY_TABLE) {
    APP.use(new proxy(x, PROXY_TABLE[x]))
}

APP.use(devMiddleware)
APP.use(hotMiddleware)
APP.use(express.static(project.basePath))

module.exports = {
    APP,
    PORT
}
