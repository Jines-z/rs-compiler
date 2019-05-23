#!/usr/bin/env node

const argv = process.argv.slice(2)[0]

require('./update')(() => {
    switch (argv){
        case 'start':
            require('./start')
            break;
        case 'build':
            require('./build')
            break;
        case 'dll':
            require('./dll')
            break;
        default:
            break;
    }
})
