const cwd        = process.cwd()
const webpack    = require('webpack')
const WebpackBar = require('webpackbar')
const path       = require('path')
const project    = require(`${cwd}/project.config`)
const VENDOR     = project.vendor
const BASE_PATH  = project.basePath

module.exports = {
    entry: {
        vendor: VENDOR
    },
    mode  : 'production',
    output: {
        path     : path.resolve(BASE_PATH, 'dll'),
        filename : '[name].dll.[hash:5].js',
        library  : '[name]_library'
    },
    performance: {
        hints: false
    },
    plugins: [
        new WebpackBar({
            minimal: false,
            compiledIn: false
        }),
        new webpack.DllPlugin({
            name    : '[name]_library',
            path    : path.resolve(BASE_PATH, 'dll', 'manifest.json'),
            context : BASE_PATH
        })
    ]
};
