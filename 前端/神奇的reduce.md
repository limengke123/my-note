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

你也可以写成箭头函数的形式：

```js
var flattened = [[0, 1], [2, 3], [4, 5]].reduce(
 ( acc, cur ) => acc.concat(cur),
 []
);
```

### 计算数组中每个元素出现的次数

```js
var names = ['Alice', 'Bob', 'Tiff', 'Bruce', 'Alice'];

var countedNames = names.reduce(function (allNames, name) { 
  if (name in allNames) {
    allNames[name]++;
  }
  else {
    allNames[name] = 1;
  }
  return allNames;
}, {});
// countedNames is:
// { 'Alice': 2, 'Bob': 1, 'Tiff': 1, 'Bruce': 1 }
```

### 使用扩展运算符和initialValue绑定包含在对象数组中的数组

```js
// friends - an array of objects 
// where object field "books" - list of favorite books 
var friends = [{
  name: 'Anna',
  books: ['Bible', 'Harry Potter'],
  age: 21
}, {
  name: 'Bob',
  books: ['War and peace', 'Romeo and Juliet'],
  age: 26
}, {
  name: 'Alice',
  books: ['The Lord of the Rings', 'The Shining'],
  age: 18
}];

// allbooks - list which will contain all friends' books +  
// additional list contained in initialValue
var allbooks = friends.reduce(function(prev, curr) {
  return [...prev, ...curr.books];
}, ['Alphabet']);

// allbooks = [
//   'Alphabet', 'Bible', 'Harry Potter', 'War and peace', 
//   'Romeo and Juliet', 'The Lord of the Rings',
//   'The Shining'
// ]
```

### 数组去重

```js
let arr = [1,2,1,2,3,5,4,5,3,4,4,4,4];
let result = arr.sort().reduce((init, current)=>{
    if(init.length===0 || init[init.length-1]!==current){
        init.push(current);
    }
    return init;
}, []);
console.log(result); //[1,2,3,4,5]
```

### 同时实现map和filter

```js
const numbers = [10, 20, 30, 40];
const doubledOver50 = numbers.reduce((finalList, num) => {
  
  num = num * 2; 
  
  if (num > 50) {
    finalList.push(num);
  }
  return finalList;
}, []);
doubledOver50; // [60, 80]
```

### 匹配圆括号

reduce的另外一个用途是能够匹配给定字符串中的圆括号。对于一个含有圆括号的字符串，我们需要知道(和)的数量是否一致，并且(是否出现在)之前。

下面的代码中我们使用reduce可以轻松地解决这个问题。我们只需要先声明一个counter变量，初值为0。在遇到(时counter加一，遇到)时counter减一。如果左右括号数目匹配，那最终结果为0。

```js
//Returns 0 if balanced.
const isParensBalanced = (str) => {
  return str.split('').reduce((counter, char) => {
    if(counter < 0) { //matched ")" before "("
      return counter;
    } else if(char === '(') {
      return ++counter;
    } else if(char === ')') {
      return --counter;
    }  else { //matched some other char
      return counter;
    }
    
  }, 0); //<-- starting value of the counter
}
isParensBalanced('(())') // 0 <-- balanced
isParensBalanced('(asdfds)') //0 <-- balanced
isParensBalanced('(()') // 1 <-- not balanced
isParensBalanced(')(') // -1 <-- not balanced
```

## Polyfill

```js
// Production steps of ECMA-262, Edition 5, 15.4.4.21
// Reference: http://es5.github.io/#x15.4.4.21
// https://tc39.github.io/ecma262/#sec-array.prototype.reduce
if (!Array.prototype.reduce) {
  Object.defineProperty(Array.prototype, 'reduce', {
    value: function(callback /*, initialValue*/) {
      if (this === null) {
        throw new TypeError( 'Array.prototype.reduce ' + 
          'called on null or undefined' );
      }
      if (typeof callback !== 'function') {
        throw new TypeError( callback +
          ' is not a function');
      }

      // 1. Let O be ? ToObject(this value).
      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0; 

      // Steps 3, 4, 5, 6, 7      
      var k = 0; 
      var value;

      if (arguments.length >= 2) {
        value = arguments[1];
      } else {
        while (k < len && !(k in o)) {
          k++; 
        }

        // 3. If len is 0 and initialValue is not present,
        //    throw a TypeError exception.
        if (k >= len) {
          throw new TypeError( 'Reduce of empty array ' +
            'with no initial value' );
        }
        value = o[k++];
      }

      // 8. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kPresent be ? HasProperty(O, Pk).
        // c. If kPresent is true, then
        //    i.  Let kValue be ? Get(O, Pk).
        //    ii. Let accumulator be ? Call(
        //          callbackfn, undefined,
        //          « accumulator, kValue, k, O »).
        if (k in o) {
          value = callback(value, o[k], k, o);
        }

        // d. Increase k by 1.      
        k++;
      }

      // 9. Return accumulator.
      return value;
    }
  });
}
```

[参考链接](https://segmentfault.com/a/1190000013972464?utm_source=feed-content)
