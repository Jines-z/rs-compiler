const ora         = require('ora')
const spinners    = require('cli-spinners')

const Spinner = new ora({
    color: 'white'
})

module.exports = Spinner
