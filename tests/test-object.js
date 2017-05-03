const _ = require('./../src')
const log = console.log.bind(console)

const matcher = _.matcher()
    .case({ age: 1 }, _.format('{name} is new borned.'))
    .case({ age: _.and(_.gte(10), _.lt(20)) }, _.format('{name} is teen-age youths.'))
    .case({ age: 30 }, _.format('{name} is young.'))
    .case({ age: _.gte(60) }, _.format('{name} is old.'))
    .case(_.isType('undefined'), 'undefined.')
    .default(_.format('{name} is {age}.'))

log(matcher.invoke({ name: 'Mike', age: 1 }))
log(matcher.invoke({ name: 'Tino', age: 18 }))
log(matcher.invoke({ name: 'Betsy', age: 30 }))
log(matcher.invoke({ name: 'Teresi', age: 70 }))
log(matcher.invoke({ name: 'Rose', age: 40 }))
log(matcher.invoke(undefined))
log(matcher.invoke(null))
