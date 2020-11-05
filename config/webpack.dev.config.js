const cwd      = process.cwd()
const webpack  = require('webpack')
const chalk    = require('chalk')
const merge    = require('webpack-merge')
const progress = require('progress-bar-webpack-plugin')
const base     = require('./webpack.base.config')
const project  = require(`${cwd}/project.config`)

const SRC_DIR = project.srcDir
const THEME   = project.theme

const development = {
    entry: {
        main: ['webpack-hot-middleware/client?path=./__webpack_hmr']
    },
    mode   : 'development',
    devtool: 'module-eval-source-map',
    module : {
        rules: [
            {
                test: /(\.less|\.css)$/,
                use : [{
                    loader: 'style-loader'
                }, {
                    loader: 'css-loader'
                }, {
                    loader : 'less-loader',
                    options: {
                        javascriptEnabled: true,
                        paths: [SRC_DIR],
                        modifyVars: THEME
                    }
                }]
            }
        ]
    },
    plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new progress({
            width: 30,
            format: `  ${chalk.gray('｢wdm｣')}: [:bar] ` + chalk.green(':percent') + ' (:elapsed seconds)',
            clear: true,
            summary: false
        })
    ]
}

module.exports = merge(base, development)
