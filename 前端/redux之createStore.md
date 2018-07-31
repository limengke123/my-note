# redux之createStore

回顾一下 `redux` 的目录结构:

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

`redux` 在 `index.js` 中一共暴露了5个 `API`, 上一篇文章讲了下和 `redux` 关联性不太大的 `compose` 。现在正式讲一讲最核心的 `createStore`。

## createStore.js

`createStore` 大概是长成这个样子的：

```js
import $$observable from 'symbol-observable'

import ActionTypes from './utils/actionTypes'
import isPlainObject from './utils/isPlainObject'

export default function createStore(reducer, preloadedState, enhancer) {

    // 1. 对传入参数的顺序处理
    // 先忽略这一块

    // 2. 变量的定义
    let currentReducer = reducer
    let currentState = preloadedState
    let currentListeners = []
    let nextListeners = currentListeners
    let isDispatching = false

    // 3. 一系列函数定义
    function ensuerCanMutateNextListeners(){}

    function getState(){}

    function subscribe(listener){}

    function dispatch(action){}

    function replaceReducer(nextReducer){}

    function observable(){}

    // 4. dispatch一个初始化的action
    dispatch({ type: ActionTypes.INIT })

    // 5. 返回store对象
    return {
        dispatch,
        subscribe,
        getState,
        replaceReducer,
        [$$observable]: observable
    }
}
```

我们分别对这五块来看看。

### 1. 参数的顺序处理

这一步就是对传入给 `createStore` 的三个参数 `reducer` 、 `preloadedState` 、 `enhancer` 的顺序调整。

```js
export default function createStore(reducer, preloadedState, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    // 第二个参数是一个函数，没有第三个参数的情况
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
        // enhancer 不是函数就报错
      throw new Error('Expected the enhancer to be a function.')
    }
    // enhancer就是高阶函数，强化了本身这个createStore的函数，拿到增强后的createStore函数去处理
    // applyMiddleware这个函数还会涉及到这个

    return enhancer(createStore)(reducer, preloadedState)
  }

  if (typeof reducer !== 'function') {
      // reducer不是函数报错
    throw new Error('Expected the reducer to be a function.')
  }

  // 其他代码省略
}
```

### 2. 变量的定义

```js
  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let nextListeners = currentListeners
  let isDispatching = false
```

- `currentReducer` 当前 `store` 的 `reducer`，由 `createStore` 传入的第一个参数 `reducer` 初始化
- `currentState` 保存当前整个 `state` 的状态,初始值就是 `createStore` 传进来的第二个参数 `preloadedState`,相当于 `store` 的初始值
- `currentListeners` 当前的监听器，默认是空
- `nextListeners` 下一个监听器，由 `currentListeners` 赋值
- `isDispatching` 当前的 `store` 是否正在 `dispatch` 一个action

全是闭包保存的变量

### 3. 函数的定义

在 `createStore` 的最后，`dispatch` 了一个 `{ type: ActionTypes.INIT }` 对象，那就按图索骥，从 `dispatch` 函数开始看。

先把 `./utils` 下的三个辅助函数(`actionTypes` 、 `isPlainObject` 、`warning`)看一下：

actionTypes:

```js
const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

const ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`,
  REPLACE: `@@redux/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

export default ActionTypes
```

这里返回的都是随机的 `action.type`,为了区别常规业务开发写的 `action.type`，比如：`ActionTypes.INIT` 拿到的是一个类似与 `@@redux/INITg.f.m.0.0.4` 随机字符串,只有这样奇奇怪怪的随机数才不会和业务中定义的 `reducer` 所判断的 `type` 重复。

---

isPlainObject:

判断函数是否是纯对象，`[1,23]`、`new Date()`这些都会返回 `false`。

```js
export default function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}
```

---

warning:

就是一个报错函数

```js
export default function warning(message) {
  /* eslint-disable no-console */
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error(message)
  }
  /* eslint-enable no-console */
  try {
    // This error was thrown as a convenience so that if you enable
    // "break on all exceptions" in your console,
    // it would pause the execution at this line.
    throw new Error(message)
  } catch (e) {} // eslint-disable-line no-empty
}
```

#### dispatch

`dispatch` 用过 `redux` 的都知道，这就是派发 `action` 的函数，把派发出去的 `action` 交由 `reducer` 处理。

```js
function dispatch(action) {
    if (!isPlainObject(action)) {
        // action不是纯对象报错
      throw new Error(
        'Actions must be plain objects. ' +
          'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
        // action没有type属性也报错
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
          'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
        // 这个store正在dispach别的action的时候不能再dispatch另外一个action
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
        // 当前state和action交由当前的reducer处理
        // 同时改变isDispatching 为 true 表明正在处理action中，不能dispatch新的action了
      isDispatching = true
      currentState = currentReducer(currentState, action)
    } finally {
        // 修改为 false ，可以dispatch新的action
      isDispatching = false
    }

    // 赋值，最终 listeners 、 currentListeners 、nextListeners的值都是 nextListeners
    const listeners = (currentListeners = nextListeners)
    for (let i = 0; i < listeners.length; i++) {
        // 遍历调用监听的函数
      const listener = listeners[i]
      listener()
    }
    // 返回这个action, 没什么作用
    return action
}
```

核心代码就是 `currentState = currentReducer(currentState, action)`，传入 `currentState`、`action` 给 `currentReducer`，`currentReducer` 把返回值赋值给了 `currentState`。

#### subscribe

订阅监听器。

```js
  function subscribe(listener) {
    if (typeof listener !== 'function') {
        // 不给函数就报错
      throw new Error('Expected the listener to be a function.')
    }

    if (isDispatching) {
        // 正在dispatch一个store的时候是不能订阅监听器的
      throw new Error(
        'You may not call store.subscribe() while the reducer is executing. ' +
          'If you would like to be notified after the store has been updated, subscribe from a ' +
          'component and invoke store.getState() in the callback to access the latest state. ' +
          'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
      )
    }

    // 给unsubscribe调用解除订阅标识
    let isSubscribed = true

    // 下面解释为什么要调用这个ensureCanMutateNextListeners函数
    ensureCanMutateNextListeners()
    // 就是简单的把传入的listeners放到nextListeners
    nextListeners.push(listener)

    // 返回一个解除订阅的函数
    return function unsubscribe() {
      if (!isSubscribed) {
        return
      }

      if (isDispatching) {
        throw new Error(
          'You may not unsubscribe from a store listener while the reducer is executing. ' +
            'See https://redux.js.org/api-reference/store#subscribe(listener) for more details.'
        )
      }

      isSubscribed = false

      ensureCanMutateNextListeners()
      const index = nextListeners.indexOf(listener)
      // 从 nextListeners 数组中移除
      nextListeners.splice(index, 1)
    }
  }
```

订阅没什么问题，就是为啥用调用 `ensureCanMutateNextListeners` 呢？
看一下这个函数：

```js
 function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = currentListeners.slice()
    }
  }
```

这个函数就是检查 `nextListeners` 和 `currentListeners` 是否是相同的，如果是相同的就把 `currentListeners` 拷贝一个新的赋值给`nextListeners`。因为数组是引用类型的关系，如果 `nextListeners` 和 `currentListeners` 相同，像 `nextListeners` 中 `push` 新的 `listener` 的时候会直接影响到 `currentListeners` 的值。

注意到另外一点，在 `dispatch` 函数的最后遍历 `listeners` 的时候，是这样操作的： `const listeners = (currentListeners = nextListeners)`，这里 `nextListeners` 和 `currentListeners` 就相同了。

那么为啥内部需要有 `currentListeners` 和 `nextListeners`，主要是**通知订阅者的过程中发生了其他的订阅(`subscribe`)和退订(`unsubscribe`),那肯定会发生错误或者不确定性。**

这里有[一篇文章](https://segmentfault.com/a/1190000010263353)论述到这个问题。

#### getState

简单的把 `store` 的 `currentState` 返回出来。

```js
  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
          'The reducer has already received the state as an argument. ' +
          'Pass it down from the top reducer instead of reading it from the store.'
      )
    }

    return currentState
  }
```

#### replaceReducer

这个 `API` 帮你替换把原来的 `reducer` 替换成新的 `reducer`。

```js
 function replaceReducer(nextReducer) {
    if (typeof nextReducer !== 'function') {
      throw new Error('Expected the nextReducer to be a function.')
    }

    // nextReducer替换旧的reducer
    currentReducer = nextReducer
    // 注意这里也dispatch了一个随机action，和createStore的最后dispatch一个随机的初始化action功能是相同的，都是了初始化state
    dispatch({ type: ActionTypes.REPLACE })
  }
```

#### observable

不懂，还是贴一下代码：

```js
  function observable() {
    const outerSubscribe = subscribe
    return {
      /**
       * The minimal observable subscription method.
       * @param {Object} observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns {subscription} An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== 'object' || observer === null) {
          throw new TypeError('Expected the observer to be an object.')
        }

        function observeState() {
          if (observer.next) {
            observer.next(getState())
          }
        }

        observeState()
        const unsubscribe = outerSubscribe(observeState)
        return { unsubscribe }
      },

      [$$observable]() {
        return this
      }
    }
  }
```

### 4. dispatch一个初始化的action

```js
dispatch({ type: ActionTypes.INIT })
```

在最后，`dispatch` 了一个 `type` 为随机值的 `action`， 我们业务的 `reducer` 中最后没有匹配到对用的 `action.type` 都会默认返回默认的 `state`, 而这个默认的 `state` 往往又在 `reducer` 函数最开始写的时候已经给好了默认值,这样 `dispatch` 的 `action` 与任何 `reducer` 都不匹配,所以拿到了所有 `reducer` 的默认值从而 `currentState` 就被更新成了 `reducer` 定义过的默认值。

### 5. 返回的store对象

把定义好的方法挂载到一个对象上面，这个对象就是 `store` 对象。

```js
return {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [$$observable]: observable
  }
```

## 总结

`redux` 的代码是真的简洁，代码的注释甚至比代码本身还要长，还是非常值得阅读的。
