#match/matcher 是一种增强的模式匹配.

###基本的语法结构如下:

 	```	
	_.matcher(strategy)
		.case(pred0, action0)
		.case(pred1, action1)
		.case(pred2, action2)
		.case(predN, actionN)  
		.default(defaultAction) 
	```

###1. strategy 是一种比较策略, 有两种选项
 *      a)  'strict'    严格的 === 比较, (区分 +0, 0, -0是不同的, 而 NaN 和 NaN是相同的).
 *      b)  'loose'     宽松的 == , 同时忽略字母大小写
 *      默认是'strict'模式,  需要宽松模式的时候, 需要显示的编写 _.matcher('loose').
 * 
###2. pred 是一个条件/论断. 这里的pred可以有多种形式, 最终会转化为一个条件/论断的函数.
 *      a) 原始数据类型, 条件数据cond, 转化为一个(target) => equalsWithStrategy(cond, target)的函数
 *      b) 正则类型, 条件数据cond, 转化为一个(target) => cond.test(target)的函数
 *      c) 容器类型
 *          c1) object,  转化为多个 (target) => equalsWithStrategy(prop(cond, key), prop(target, key))的论断函数的$And
 *          c2) array, 同上理论
 *          c3) 特例 写成 {length:6}, {length:_.gte(6)}, 也试图去匹配一个数组的长度是否符合条件
 *          c4) 如果一个对象的嵌套比较深, 有一种简写 如 {'2.friend.name': 'Peter'}, 就是一种试图去匹配第三个元素的friend的name是不是 'Peter'
 *      d) 我们有时候不仅仅需要等于/不等于, 还需要 and, or, gte, gt, lte, lt等操作
 *         c1) { age: _.and(_.gte(10), _.lt(20)) }
 *         c2) _.and({ age: _.gte(10) }, { age: _.lt(10) })
 *         上面的c1, c2 表达了相同的语义
 *      e) 也可以是一个自定义的函数, 同时接收的参数个数不做限制
###3. action 是对应的pred下的一个动作. 这里的action同样可以有多种形式
 *      a) 数据类型,  data会转化为一个 () => data 的函数
 *      b) 含有invoke方法的对象, target会转化为 (agr0, agr1, ...argn) =>  target.invoke(agr0, agr1, ...argn)
 *      c) 函数, 不做转化.  对参数个数不做限制.
###4. 特例, 一个case只有pred,没有action, 如果这个pred被匹配, 则最近的下一个action会被执行.
 *      _matcher()
 *      .case('a')
 *      .case('b', actionB)
 *      .default(actionC),  如果target是'a', 则actionB被执行并返回.
###5. 调用matcher, 会返回第一个匹配的pred 对应的action的执行后的返回值.

##Examples
	```
	const _ = require('./../src')
	const log = console.log.bind(console)
	```
###test-match
	```	
	const r = _.match(150)
        .case(_.lt(100), _.format('{_} < 100'))
        .case(_.and(_.gte(100), _.lt(200)), _.format('100 <= {_} < 200'))
        .case(250, _.format('{_} == 250'))
        .default('{_} is other.')

	log(r)
###test-primitive
	```
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
	```
###test-array
	```	
	const matcher = _.matcher('loose')
    	.case(_.or(null, undefined, { length: 0 }), 'Array is empty.')
    	.case({ length: 1 }, 'Array has one ele.')
    	.case([_.T, { tag: 'b' }], 'Array[1]\'s tag is b.')
    	.default('Array has two or more eles.')

	log(matcher.invoke())
	log(matcher.invoke([]))
	log(matcher.invoke([1]))
	log(matcher.invoke([1, 2, 3]))
	log(matcher.invoke([{ tag: 'a' }, { tag: 'b' }, { tag: 'c' }]))
	```
###test-object
	```	
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
	```
###test-regexp
	```
	const matcher = _.matcher()
    	.case(/^\d+$/, 'number')
    	.case(/^[a-zA-Z]+$/, 'letters')
    	.default('others')

	log(matcher.invoke(1234))
	log(matcher.invoke('HELLO'))
	log(matcher.invoke([1, 2, 3]))
	```
###test-function
	```
	const fibonacci = _.matcher()
    	.case(0, 0)
    	.case(1, 1)
    	.default((v) => fibonacci.invoke(v - 1) + fibonacci.invoke(v - 2))
	log(fibonacci.invoke(20))

	const fibonacciCached = _.matcher()
    	.cacheEnabled()
    	.case(0, 0)
    	.case(1, 1)
    	.default((v) => fibonacciCached.invoke(v - 1) + fibonacciCached.invoke(v - 2))
	log(fibonacciCached.invoke(100))

	const factorial = _.matcher()
    	.case(0, 1)
    	.default((n) => n * factorial.invoke(n - 1))
	log(factorial.invoke(5))

	const max = _.matcher()
    	.case((arr, s, e) => s === undefined || e === undefined, (arr, s, e) => max.invoke(arr, s || 0, e || arr.length))
    	.case((arr, s, e) => s >= e - 1, (arr, s) => arr[s])
    	.default((arr, s, e) => Math.max(arr[s], max.invoke(arr, s + 1, e)))
	log(max.invoke([5, 6, 8, 11, 4, 3, 2]))
	```