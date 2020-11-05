const cwd                  = process.cwd()
const miniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackBar           = require('webpackbar')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const copyWebpackPlugin    = require('copy-webpack-plugin')
const merge                = require('webpack-merge')
const cssNaNo              = require('cssnano')
const postCssPresetEnv     = require('postcss-preset-env')
const path                 = require('path')
const base                 = require('./webpack.base.config')
const project              = require(`${cwd}/project.config`)

const SRC_DIR   = project.srcDir
const BASE_PATH = project.basePath
const THEME     = project.theme
const RELATIVE  = project.relative
const BAPlugin  = project.BAPlugin

const production = {
    output: {
        filename: `${RELATIVE ? '' : 'js/'}[name].[chunkhash:5].js`
    },
    mode   : 'production',
    devtool: false,
    module : {
        rules: [
            {
                test: /(\.less|\.css)$/,
                use :[
                    miniCssExtractPlugin.loader,
                    {
                        loader : 'css-loader',
                        options: {
                            importLoaders  : 2
                        }
                    },
                    {
                        loader : 'postcss-loader',
                        options: {
                            plugins: [
                                postCssPresetEnv(),
                                cssNaNo({
                                    reduceIdents: false,
                                    autoprefixer: false
                                })
                            ]
                        }
                    },
                    {
                        loader : 'less-loader',
                        options: {
                            javascriptEnabled: true,
                            paths: [SRC_DIR],
                            modifyVars: THEME
                        }
                    }
                ]
            }
        ]
    },
    optimization: {
        sideEffects: false,
        splitChunks: {
            chunks     :'all',
            minSize    : 30000,
            minChunks  : 1,
            cacheGroups: {
                common_js: {
                    name     : 'common',
                    test     : /\.js$/,
                    chunks   : 'all',
                    minSize  : 1,
                    minChunks: 2,
                    priority : 1
                },
                vendor: {
                    name    : 'vendor',
                    test    : /[\\/]node_modules[\\/]/,
                    chunks  : 'all',
                    priority: 10,
                    enforce : true
                }
            }
        }
    },
    plugins: [
        new webpackBar({
            minimal: false
        }),
        new miniCssExtractPlugin({
            filename: `${RELATIVE ? '' : 'css/'}[name].[chunkhash:5].css`
        }),
        new copyWebpackPlugin([{
            from: path.join(BASE_PATH, 'dll'),
            to  : path.join(BASE_PATH, 'dist', 'dll')
        }])
    ]
}

if (BAPlugin) {
    production.plugins.push(
        new BundleAnalyzerPlugin()
    )
}

module.exports = merge(base, production)
