# 绕不开的promise

js这玩意儿的异步处理真的是让人头疼的一个东西，回调函数这种处理方式写稍微多一点的逻辑就整个人都被绕进去了，所以嘛，业界也就搞出乱七八糟的方案，一套一套的，好在es6也接受业界的一些做法，比如就把promise、async这种异步的处理方案搞进规范了。async也离不开promise，所以深入理解promise对现代化处理异步编程很有帮助。

> 所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。从语法上说，Promise 是一个对象，从它可以获取异步操作的消息。Promise 提供统一的 API，各种异步操作都可以用同样的方法进行处理。

Promise在用起来的时候就是`new Promise((resolve,reject) => {})`,看到出来这个玩意就是一个构造函数嘛，哟，还挺奇怪，这个构造函数竟然还接受一个函数当作参数，传入的这个函数又有两个固定的参数`resolve`、`reject`，这两个参数也是两个方法。

Promise的两个特点：

1. 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：pending（进行中）、fulfilled（已成功）和rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。这也是Promise这个名字的由来，它的英语意思就是“承诺”，表示其他手段无法改变。

2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从pending变为fulfilled和从pending变为rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果，这时就称为 resolved（已定型）。如果改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。这与事件（Event）完全不同，事件的特点是，如果你错过了它，再去监听，是得不到结果的。

## 怎么用

就是`new`一个`Promise`实例出来，用这个实例的`then`方法搞。

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code

  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

### Promise.prototype.then()

> Promise 实例具有then方法，也就是说，then方法是定义在原型对象Promise.prototype上的。它的作用是为 Promise 实例添加状态改变时的回调函数。前面说过，then方法的第一个参数是resolved状态的回调函数，第二个参数（可选）是rejected状态的回调函数。

then方法很重要，甚至可以继续返回一个promise链式调用

```js
getJSON("/post/1.json").then(
  post => getJSON(post.commentURL)
).then(
  comments => console.log("resolved: ", comments),
  err => console.log("rejected: ", err)
);
```

### Promise.prototype.catch()

`promise`的异常捕获是个难点，重点掌握。

> `Promise.prototype.catch`方法是`.then(null, rejection)`的别名，用于指定发生错误时的回调函数,这就说明catch也和then一样返回一个promise，可以继续then和catch。

```js
p.then((val) => console.log('fulfilled:', val))
  .catch((err) => console.log('rejected', err));

// 等同于
p.then((val) => console.log('fulfilled:', val))
  .then(null, (err) => console.log("rejected:", err));
```

如果该对象状态变为`resolved`，则会调用`then`方法指定的回调函数；如果异步操作抛出错误，状态就会变为`rejected`，就会调用`catch`方法指定的回调函数，处理这个错误。**另外，then方法指定的回调函数，如果运行中抛出错误，也会被catch方法捕获**

```js
// 写法一
const promise = new Promise(function(resolve, reject) {
  try {
    throw new Error('test');
  } catch(e) {
    reject(e);
  }
});
promise.catch(function(error) {
  console.log(error);
});

// 写法二
const promise = new Promise(function(resolve, reject) {
  reject(new Error('test'));
});
promise.catch(function(error) {
  console.log(error);
});
```

这两种写法相同，reject相当于抛出异常，然后让catch捕获。
**如果 Promise 状态已经变成resolved，再抛出错误是无效的。**

```js
const promise = new Promise(function(resolve, reject) {
  resolve('ok');
  throw new Error('test');
});
promise
  .then(function(value) { console.log(value) })
  .catch(function(error) { console.log(error) });
// ok
```

上面代码中，`Promise` 在`resolve`语句后面，再抛出错误，不会被捕获，等于没有抛出。因为 `Promise` 的状态一旦改变，就永久保持该状态，不会再变了。

`Promise`对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。
**所以一般在最后面加上一个`catch`就够了，没必要在每个`then`方法里面传入第二个捕获错误的参数，`then就只要处理成功的情况就行**

> **Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”**

所以在`node`中`process`有个`unhandleRejection`专门来捕获这种`promise`中没有捕获的异常

```js
process.on('unhandledRejection', function (err, p) {
  throw err;
});
```

### Promise.prototype.finally()

`finally`方法用于指定不管 `Promise` 对象最后状态如何，都会执行的操作。
finally本质上是then方法的特例，实际上就是简化了成功和失败共同要做的事情。

```js
promise
.finally(() => {
  // 语句
});

// 等同于
promise
.then(
  result => {
    // 语句
    return result;
  },
  error => {
    // 语句
    throw error;
  }
);
```

### Promise.all()

`Promise.all`方法用于将多个 `Promise` 实例，包装成一个新的 `Promise` 实例。

```js
const p = Promise.all([p1, p2, p3]);
```

1. `p1`、`p2`、`p3`全部成功后，`p1`、`p2`、`p3`的返回值组成一个数组传给P的回调
2. 其中一个失败，就把失败的reject传给P的失败回调

同样这里也存在异常的处理情况，**作为参数的promise自己定义了catch方法，则如果出现异常外层的promise不能捕获到**

### Promise.race()

和Promise.all差不多

```js
const p = Promise.race([p1, p2, p3]);
```

上面代码中，只要p1、p2、p3之中有一个实例率先改变状态，p的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给p的回调函数。

### Promise.resolve()

有时需要将现有对象转为 Promise 对象，Promise.resolve方法就起到这个作用。

```js
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

需要注意的是，立即resolve的 Promise 对象，是在本轮“事件循环”（event loop）的结束时，而不是在下一轮“事件循环”的开始时。

```js
setTimeout(function () {
  console.log('three');
}, 0);

Promise.resolve().then(function () {
  console.log('two');
});

console.log('one');

// one
// two
// three
```

上面代码中，setTimeout(fn, 0)在下一轮“事件循环”开始时执行，Promise.resolve()在本轮“事件循环”结束时执行，console.log('one')则是立即执行，因此最先输出。

这种用处不多，倒是这种类型面试题不少。

### Promise.reject()

和Promise.resolve()差不多。

### Promise.try()

不管f是否包含异步操作，都用then方法指定下一步流程，用catch方法处理f抛出的错误

[参考文献](https://juejin.im/post/5ab20c58f265da23a228fe0f?utm_source=gold_browser_extension)