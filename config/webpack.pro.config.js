const cwd                  = process.cwd()
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const WebpackBar           = require('webpackbar')
const CopyWebpackPlugin    = require('copy-webpack-plugin')
const merge                = require('webpack-merge')
const CssNaNo              = require('cssnano')
const PostCssPresetEnv     = require('postcss-preset-env')
const path                 = require('path')
const base                 = require('./webpack.base.config')
const project              = require(`${cwd}/project.config`)

const SRC_DIR   = project.srcDir
const BASE_PATH = project.basePath
const THEME     = project.theme
const RELATIVE  = project.relative

const production = {
    output: {
        filename: `${RELATIVE ? '' : 'JS/'}[name].[chunkhash:5].js`
    },
    mode   : 'production',
    devtool: false,
    module : {
        rules: [
            {
                test: /(\.less|\.css)$/,
                use :[
                    MiniCssExtractPlugin.loader,
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
                                PostCssPresetEnv(),
                                CssNaNo({
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
                vendor: {
                    name    : 'vendor',
                    test    : /[\\/]node_modules[\\/]/,
                    chunks  : 'all',
                    priority: -10,
                    enforce : true
                }
            }
        }
    },
    plugins: [
        new WebpackBar({
            minimal: false
        }),
        new MiniCssExtractPlugin({
            filename: `${RELATIVE ? '' : 'css/'}[name].[chunkhash:5].css`
        }),
        new CopyWebpackPlugin([{
            from: path.join(BASE_PATH, 'dll'),
            to  : path.join(BASE_PATH, 'dist', 'dll')
        }])
    ]
}

module.exports = merge(base, production)
