const cast = require('./cast.js')
const { curry, _ } = require('./curry.js')
const match = require('./match.js')
const matcher = require('./matcher.js')
const pred = require('./pred.js')
const typof = require('./typof.js')
const format = require('./format.js')

module.exports = {
    eq: pred.eq,
    gte: pred.gte,
    gt: pred.gt,
    lte: pred.lte,
    lt: pred.lt,
    and: pred.and,
    or: pred.or,
    not: pred.not,
    equalsIgnoreCase: pred.equalsIgnoreCase,
    T: pred.T,
    F: pred.F,
    isType: pred.isType,
    isEmpty: pred.isEmpty,
    prop: pred.prop,
    format: curry(format),
    cast,
    match,
    matcher,
    typof,
    curry, _
}
