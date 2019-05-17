const cwd     = process.cwd()
const webpack = require('webpack')
const merge   = require('webpack-merge')
const base    = require('./webpack.base.config')
const project = require(`${cwd}/project.config`)
const SRC_DIR = project.srcDir
const THEME   = project.theme

const development = {
    entry: {
        main: ['webpack-hot-middleware/client?path=./__webpack_hmr']
    },
    mode   : 'development',
    devtool: 'cheap-module-eval-source-map',
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
        new webpack.HotModuleReplacementPlugin()
    ]
}

module.exports = merge(base, development)
