# redux之compose

`redux` 是状态管理库，与其他框架如 `react` 是没有直接关系，所以 `redux` 可以脱离 `react` 在别的环境下使用。由于没有和`react` 相关逻辑耦合，所以 `redux` 的源码很纯粹，目的就是把如何数据管理好。而真正在 `react` 项目中使用 `redux` 时，是需要有一个 `react-redux` 当作连接器，去连接 `react` 和 `redux` 。

没看 `redux` 源码之前，我觉得看 `redux` 应该是件很困难的事情，因为当初在学 `redux` 如何使用的时候就已经被 `redux` 繁多的概念所淹没。真正翻看 `redux` 源码的时候，会发现 `redux` 源码内容相当之少，代码量也相当少，代码质量也相当高，所以是非常值得看的源码。

## 目录结构

其他目录都可以不看，直接看 `./src` 吧：

.\REDUX\SRC
│  applyMiddleware.js
│  bindActionCreators.js
│  combineReducers.js
│  compose.js
│  createStore.js
│  index.js
│
└─utils
        actionTypes.js
        isPlainObject.js
        warning.js

`index.js` 就是把 `applyMiddleware.js` 等汇集再统一暴露出去。`utils` 里面就放一些辅助函数。所以一共就五个文件需要看，这五个文件也就是 `redux` 暴露出去的五个 `API`。

```js
// index.js
import createStore from './createStore'
import combineReducers from './combineReducers'
import bindActionCreators from './bindActionCreators'
import applyMiddleware from './applyMiddleware'
import compose from './compose'
import warning from './utils/warning'
import __DO_NOT_USE__ActionTypes from './utils/actionTypes'

// 忽略内容

export {
  createStore,
  combineReducers,
  bindActionCreators,
  applyMiddleware,
  compose,
  __DO_NOT_USE__ActionTypes
}
```

## compose.js

这是五个 `API` 里唯一一个能单独拿出来用的函数，就是函数式编程里常用的组合函数，和 `redux` 本身没有什么多大关系，先了解下函数式编程的一些概念：

> [纯函数](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html#%E8%BF%BD%E6%B1%82%E2%80%9C%E7%BA%AF%E2%80%9D%E7%9A%84%E7%90%86%E7%94%B1)是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。
> [代码组合](https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch5.html)

代码：

```js
export default function compose(...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}
```

其实 `compose` 函数做的事就是把 `var a = fn1(fn2(fn3(fn4(x))))` 这种嵌套的调用方式改成 `var a = compose(fn1,fn2,fn3,fn4)(x)` 的方式调用。

`redux` 的 `compose` 实现很简洁，用了数组的 `reduce` 方法，`reduce` 的用法可以参照 [mdn](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)。

核心代码就一句：`return funcs.reduce((a,b) => (..args) => a(b(...args)))`

我虽然经常写 `reduce` 函数，但是看到这句代码还是有点懵的，所以这里举一个实际的例子，看看这个函数是怎么执行的：

```js
import {compose} from 'redux'
let x = 10
function fn1 (x) {return x + 1}
function fn2(x) {return x + 2}
function fn3(x) {return x + 3}
function fn4(x) {return x + 4}

// 假设我这里想求得这样的值
let a = fn1(fn2(fn3(fn4(x)))) // 10 + 4 + 3 + 2 + 1 = 20

// 根据compose的功能，我们可以把上面的这条式子改成如下：
let composeFn = compose(fn1, fn2, fn3, fn4)
let b = composeFn(x) // 理论上也应该得到20
```

看一下 `compose(fn1, fn2, fn3, fn4)`根据 `compose` 的源码, 其实执行的就是：
`[fn1,fn2,fn3.fn4].reduce((a, b) => (...args) => a(b(...args)))`

| 第几轮循环 | a的值 | b的值 | 返回的值 |
| --- | --- | --- | --- |
| 第一轮循环 | fn1 | fn2 | (...args) => fn1(fn2(...args)) |
| 第二轮循环 | (...args) => fn1(fn2(...args)) | fn3 | (...args) => fn1(fn2(fn3(...args))) |
| 第三轮循环 | (...args) => fn1(fn2(fn3(...args))) | fn4 | (...args) => fn1(fn2(fn3(fn4(...args)))) |

循环最后的返回值就是 `(...args) => fn1(fn2(fn3(fn4(...args))))`。所以经过 `compose` 处理过之后，函数就变成我们想要的格式了。

## 总结

`compose` 函数在函数式编程里很常见。这里 `redux` 的对 `compose` 实现很简单，理解起来却没有那么容易，主要还是因为对 `Array.prototype.reduce` 函数没有那么熟练，其次就是这种接受函数返回函数的写法，再配上几个连续的 `=>` ，容易看晕。

这是 `redux` 解读的第一篇，后续把几个 `API` 都讲一下。特别是 `applyMiddleware` 这个 `API` 有用到这个 `compose` 来组合中间件，也是有那么一个点比较难理解。