const cwd                  = process.cwd()
const express              = require('express')
const webpack              = require('webpack')
const opn                  = require('opn')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compress             = require('compression')
const proxy                = require('http-proxy-middleware')
const webpackConfig        = require('../config/webpack.dev.config')
const project              = require(`${cwd}/project.config`)

const COMPILER    = webpack(webpackConfig)
const APP         = express()
const PORT        = project.port
const PROXY_TABLE = project.proxy

APP.use(compress())

const devMiddleware = webpackDevMiddleware(COMPILER, {
    quiet   : false,
    noInfo  : false,
    lazy    : false,
    headers : {'Access-Control-Allow-Origin': '*'},
    stats   : 'errors-only',
})

devMiddleware.waitUntilValid(() => {
    opn('http://localhost:' + PORT)
})

const hotMiddleware = webpackHotMiddleware(COMPILER, {
    path : '/__webpack_hmr',
    log  : false
})

for (let x in PROXY_TABLE) {
    APP.use(proxy(x, PROXY_TABLE[x]))
}

APP.use(devMiddleware)
APP.use(hotMiddleware)
APP.use(express.static(project.basePath))

module.exports = {
    APP,
    PORT
}
