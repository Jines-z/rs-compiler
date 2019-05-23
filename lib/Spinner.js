const ora         = require('ora')
const spinners    = require('cli-spinners')

const Spinner = new ora({
    spinner: spinners.dots,
    color: 'white'
})

module.exports = Spinner
