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

class Server {
    constructor() {
        this.app      = express()
        this.compiler = webpack(webpackConfig)
        this.port     = project.port
        this.host     = project.host
        this.proxy    = project.proxy
        this.open     = project.open
        this.basePath = project.basePath
        this.devMiddleware = null
        this.hotMiddleware = null
    }
    start() {
        this.done()
        this.dev()
        this.hot()
        this.setProxy()
        this.app.use(compress())
        this.app.use(this.devMiddleware)
        this.app.use(this.hotMiddleware)
        this.app.use(express.static(this.basePath))
        this.app.listen(this.port, this.host)
    }
    done() {
        this.compiler.hooks.done.tap('rs-compiler', () => {
            clearCMD()
        })
    }
    watchRun() {
        this.compiler.hooks.watchRun.tap('rs-compiler', () => {
            clearCMD()
        })
    }
    hot() {
        this.hotMiddleware = webpackHotMiddleware(this.compiler, {
            path : '/__webpack_hmr',
            log  : false
        })
    }
    dev() {
        this.devMiddleware = webpackDevMiddleware(this.compiler, {
            headers : {'Access-Control-Allow-Origin': '*'},
            stats   : 'errors-warnings'
        })
        this.devMiddleware.waitUntilValid(() => {
            this.openBrowser()
            this.watchRun()
            process.send && process.send('wdm-cb')
        })
    }
    openBrowser() {
        let host = ''
        if (this.host === '0.0.0.0') {
            try {
                host = address.ip()
            } catch (e) {
                host = 'localhost'
            }
        } else {
            host = this.host || 'localhost'
        }
        if (this.open) {
            opn(`http://${host}:${this.port}`)
        }
    }
    setProxy() {
        if (this.proxy) {
            for (let x in this.proxy) {
                this.app.use(new proxyMiddleware(x, this.proxy[x]))
            }
        }
    }
}

module.exports = new Server()
