const _ = require('./../src')
const log = console.log.bind(console)

const matcher = _.matcher()
    .case(/^\d+$/, 'number')
    .case(/^[a-zA-Z]+$/, 'letters')
    .default('others')

log(matcher.invoke(1234))
log(matcher.invoke('HELLO'))
log(matcher.invoke([1, 2, 3]))
