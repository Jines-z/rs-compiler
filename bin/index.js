#!/usr/bin/env node

const argv    = process.argv.slice(2)[0]
const cwd     = process.cwd()
const project = require(`${cwd}/project.config`)

const actions = () => {
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
}

if (project.update) {
    require('./update')(actions)
} else {
    actions()
}
