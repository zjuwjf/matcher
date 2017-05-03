const _ = require('./../src')
const log = console.log.bind(console)

const matcher = _.matcher('loose')
    .case(1, '1 or \'1\'')
    .case('hello', 'hello(ignoreCase)')
    .case({}, 'Object')
    .case([], 'Array')
    .default('Others')

log(matcher.invoke('1'))
log(matcher.invoke('HELLO'))
log(matcher.invoke({name : 'hello'}))
log(matcher.invoke([1, 2, 3]))
