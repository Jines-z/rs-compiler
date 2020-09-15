const cwd                 = process.cwd()
const webpack             = require('webpack')
const path                = require('path')
const htmlWebpackPlugin   = require('html-webpack-plugin')
const includeAssetsPlugin = require('html-webpack-include-assets-plugin')
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
const CONFIG       = project.config || {}

const ESLintRule = () => ({
    test: /\.(j|t)sx?$/,
    use : {
        loader : 'eslint-loader',
        options: {
            cache: true
        }
    },
    enforce: 'pre',
    include: SRC_DIR,
    exclude: /node_modules/
})

const base = {
    entry: {
        main: ['@babel/polyfill', SRC_DIR],
        ...(CONFIG.entry || {})
    },
    output: {
        publicPath: RELATIVE ? './' : PUBLIC_PATH,
        path: OUT_DIR,
        ...(CONFIG.output || {})
    },
    resolve: {
        alias: {
            '@': SRC_DIR
        },
        modules: [SRC_DIR, 'node_modules'],
        extensions: ['.js', '.jsx', '.tsx', '.ts', '.json', '.less', '.scss', '.css'],
        ...(CONFIG.resolve || {})
    },
    externals: {
        ...(CONFIG.externals || {})
    },
    module: {
        rules: [
            ...(ESLINT ? [ESLintRule()] : []),
            {
                test: /\.(j|t)sx?$/,
                use : [,
                    'cache-loader',
                    {
                        loader : 'babel-loader',
                        options: babelRC
                    }
                ],
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
            },
            ...((CONFIG.module && CONFIG.module.rules) ? CONFIG.module.rules : [])
        ]
    },
    performance: {
        hints: false,
        ...(CONFIG.performance || {})
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
        new htmlWebpackPlugin({
            template: 'index.html',
            inject  : true,
            minify  : {
                removeComments: ENV === 'production',
                collapseWhitespace: ENV === 'production',
                removeAttributeQuotes: ENV === 'production',
            },
            ...HTML_OPTIONS
        }),
        new includeAssetsPlugin({
            assets: [{
                path    : 'dll',
                glob    : '*.js',
                globPath: path.join(BASE_PATH, 'dll')
            }],
            append: false
        }),
        ...(CONFIG.plugins || [])
    ]
}

module.exports = base
