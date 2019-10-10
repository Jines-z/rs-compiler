const cwd                 = process.cwd()
const webpack             = require('webpack')
const path                = require('path')
const HtmlWebpackPlugin   = require('html-webpack-plugin')
const IncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const ESLintFormatter     = require('eslint-friendly-formatter')
const project             = require(`${cwd}/project.config`)
const babelRC             = require('../babelrc')

const ENV          = project.env
const GLOBAL       = project.global
const ESLINT       = project.esLint
const RELATIVE     = project.relative
const SRC_DIR      = project.srcDir
const OUT_DIR      = project.outDir
const BASE_PATH    = project.basePath
const HTML_OPTIONS = project.html
const PUBLIC_PATH  = project.publicPath

const ESLintRule = () => ({
    test: /\.(j|t)sx?$/,
    use : {
        loader : 'eslint-loader?cacheDirectory',
        options: {
            formatter: ESLintFormatter
        }
    },
    enforce: 'pre',
    include: SRC_DIR,
    exclude: /node_modules/
})

const base = {
    entry: {
        main: ['@babel/polyfill', SRC_DIR]
    },
    output: {
        publicPath: RELATIVE ? './' : PUBLIC_PATH,
        path: OUT_DIR
    },
    resolve: {
        alias: {
            '@': SRC_DIR
        },
        modules: [SRC_DIR, 'node_modules'],
        extensions: ['.js', '.jsx', '.tsx', '.ts', '.json', '.less', '.scss', '.css']
    },
    module: {
        rules: [
            ...(ESLINT ? [ESLintRule()] : []),
            {
                test: /\.(j|t)sx?$/,
                use : {
                    loader : 'babel-loader?cacheDirectory',
                    options: babelRC
                },
                include: SRC_DIR,
                exclude: /node_modules/
            },
            {
                test: /\.(png|PNG|jpe?g|JPG|gif|GIF|svg)(\?.*)?$/,
                use : {
                    loader : 'url-loader',
                    options: {
                        limit: 10000,
                        name : `${RELATIVE ? '' : 'images/'}[name].[hash:5].[ext]`
                    }
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                use : {
                    loader : 'url-loader',
                    options: {
                        limit: 10000,
                        name : `${RELATIVE ? '' : 'media/'}[name].[hash:5].[ext]`
                    }
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 10000,
                        name : `${RELATIVE ? '' : 'fonts/'}[name].[hash:5].[ext]`
                    }
                }
            }
        ]
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpack.DefinePlugin((() => {
            const obj = {}
            for (let x in GLOBAL) {
                obj[`__${x.toUpperCase()}__`] = JSON.stringify(GLOBAL[x])
            }
            return obj
        })()),
        new webpack.DllReferencePlugin({
            context : BASE_PATH,
            manifest: path.resolve(BASE_PATH, 'dll', 'manifest.json')
        }),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject  : true,
            minify  : {
                removeComments: ENV === 'production',
                collapseWhitespace: ENV === 'production',
                removeAttributeQuotes: ENV === 'production',
            },
            ...HTML_OPTIONS
        }),
        new IncludeAssetsPlugin({
            assets: [{
                path    : 'dll',
                glob    : '*.js',
                globPath: path.join(BASE_PATH, 'dll')
            }],
            append: false
        })
    ]
}

module.exports = base
