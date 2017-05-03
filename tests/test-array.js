const _ = require('./../src')
const log = console.log.bind(console)

const matcher = _.matcher('loose')
    .case(_.or(null, undefined, { length: 0 }), 'Array is empty.')
    .case({ length: 1 }, 'Array has one ele.')
    .case([_.T, { name: 'lingoes' }], 'Array[1]\'s name is lingoes.')
    .default('Array has two or more eles.')

log(matcher.invoke())
log(matcher.invoke([]))
log(matcher.invoke([1]))
log(matcher.invoke([1, 2, 3]))
log(matcher.invoke([{ name: 'mike' }, { name: 'lingoes', university: 'zju' }, { name: 'Jordan' }]))
