const _ = require('./../src')
const log = console.log.bind(console)

const r = _.match(150)
        .case(_.lt(100), _.format('{_} < 100'))
        .case(_.and(_.gte(100), _.lt(200)), _.format('100 <= {_} < 200'))
        .case(250, _.format('{_} == 250'))
        .default('{_} is other.')

log(r)
