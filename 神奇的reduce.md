# 神奇的reduce

这是一个用得好就很装逼的方法，简约而强大。

## 干什么用的

> reduce() 方法对累加器和数组中的每个元素（从左到右）应用一个函数，将其减少为单个值。
说的挺复杂，看个mdn例子先：

```js
const arrary1 = [1, 2, 3, 4]
const reducer = (accumulator, currentValue) => accumulator + currentValue
//1+2+3+4
console.log(array1.reduce(reducer))

//5+1+2+3+4
console.log(array1.reduce(reducer, 5))
```

## 语法

```js
arr.reduce(callback[,initalValue])
```

### 参数

* callback 回调函数
  * accumulator **累加器累加回调的返回值**
  * currentValue **数组中正在处理的元素**
  * currentIndex(optional) 数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1。
  * array(optional) 调用reduce的数组

* initalValue(optional) 用作第一个调用 callback的第一个参数的值

### 返回值

函数累计处理的结果

## 描述

`reduce`为数组中的每一个元素依次执行`callback`函数，不包括数组中被删除或从未被赋值的元素，接受四个参数。

回调函数第一次执行时，`accumulator`和`currentValue`的取值有两种情况：调用`reduce`时提供`initialValue`，`accumulator`取值为`initialValue`，`currentValue`取数组中的第一个值；没有提供 `initialValue`，`accumulator`取数组中的第一个值，`currentValue`取数组中的第二个值。

> 如果没有提供`initialValue`，`reduce` 会从索引1的地方开始执行 `callback` 方法，跳过第一个索引。如果提供`initialValue`，从索引0开始。

如果数组为空且没有提供`initialValue`，会抛出`TypeError` 。如果数组仅有一个元素（无论位置如何）并且没有提供`initialValue`， 或者有提供`initialValue`但是数组为空，那么此唯一值将被返回并且`callback`不会被执行。

提供初始值通常更安全，正如下面的例子，如果没有提供initialValue，则可能有三种输出：

```js
var maxCallback = ( pre, cur ) => Math.max( pre.x, cur.x );
var maxCallback2 = ( max, cur ) => Math.max( max, cur );

// reduce() without initialValue
[ { x: 22 }, { x: 42 } ].reduce( maxCallback ); // 42
[ { x: 22 }            ].reduce( maxCallback ); // { x: 22 }
[                      ].reduce( maxCallback ); // TypeError

// map/reduce; better solution, also works for empty arrays
[ { x: 22 }, { x: 42 } ].map( el => el.x )
                        .reduce( maxCallback2, -Infinity );
```

### reduce如何运行

假如运行下段代码：

```js
[0, 1, 2, 3, 4].reduce(function(accumulator, currentValue, currentIndex, array){
  return accumulator + currentValue;
});
```

| callback    | accumulator | currentValue | currentIndex | array           | return value |
| ----------- | ----------- | ------------ | ------------ | --------------- | ------------ |
| first call  | 0           | 1            | 1            | [0, 1, 2, 3, 4] | 1            |
| second call | 1           | 2            | 2            | [0, 1, 2, 3, 4] | 3            |
| third call  | 3           | 3            | 3            | [0, 1, 2, 3, 4] | 6            |
| fourth call | 6           | 4            | 4            | [0, 1, 2, 3, 4] | 10           |
由`reduce`返回的值将是上次回调调用的值`（10）`。

你同样可以使用箭头函数的形式，下面的代码会输出跟前面一样的结果

您还可以提供[Arrow Function](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions/Arrow_functions) 代替完整功能。 下面的代码将产生与上面的代码中相同的输出：

```js
[0, 1, 2, 3, 4].reduce((prev, curr) => prev + curr );
```

如果你打算提供一个初始值作为`reduce`方法的第二个参数，以下是运行过程及结果：

```js
[0, 1, 2, 3, 4].reduce((accumulator, currentValue, currentIndex, array) => { return accumulator + currentValue; }, 10 )
```

| callback    | accumulator | currentValue | currentIndex | array           | return value |
| ----------- | ----------- | ------------ | ------------ | --------------- | ------------ |
| first call  | 10          | 0            | 0            | [0, 1, 2, 3, 4] | 10           |
| second call | 10          | 1            | 1            | [0, 1, 2, 3, 4] | 11           |
| third call  | 11          | 2            | 2            | [0, 1, 2, 3, 4] | 13           |
| fourth call | 13          | 3            | 3            | [0, 1, 2, 3, 4] | 16           |
| fourth call | 16          | 4            | 4            | [0, 1, 2, 3, 4] | 20           |
这种情况下reduce返回的值是`20`。

## 例子

数组里所有值的和

```js
var sum = [0, 1, 2, 3].reduce(function (a, b) {
  return a + b;
}, 0);
// sum is 6
```

你也可以写成箭头函数的形式：

```js
var total = [ 0, 1, 2, 3 ].reduce(
  ( acc, cur ) => acc + cur,
  0
);
```

### 将二维数组转化为一维

```js
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
  function(a, b) {
    return a.concat(b);
  },
  []
);
// flattened is [0, 1, 2, 3, 4, 5]
```

[参考链接](https://segmentfault.com/a/1190000013972464?utm_source=feed-content)
