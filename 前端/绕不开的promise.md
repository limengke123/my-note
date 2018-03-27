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

[参考文献](https://juejin.im/post/5ab20c58f265da23a228fe0f?utm_source=gold_browser_extension)