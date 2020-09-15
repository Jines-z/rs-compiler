const cwd        = process.cwd()
const webpack    = require('webpack')
const webpackBar = require('webpackbar')
const path       = require('path')
const project    = require(`${cwd}/project.config`)

const VENDOR    = project.vendor
const BASE_PATH = project.basePath
const DLL_DIR   = project.dllDir

module.exports = {
    entry: {
        vendor: VENDOR
    },
    mode  : 'production',
    output: {
        path     : DLL_DIR,
        filename : '[name].dll.[hash:5].js',
        library  : '[name]_library'
    },
    performance: {
        hints: false
    },
    plugins: [
        new webpackBar({
            minimal: false,
            compiledIn: false
        }),
        new webpack.DllPlugin({
            name    : '[name]_library',
            path    : path.resolve(DLL_DIR, 'manifest.json'),
            context : BASE_PATH
        })
    ]
};
