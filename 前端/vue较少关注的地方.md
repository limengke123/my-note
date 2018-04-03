# vue较少关注的地方

`vue`总体来说还是很简单的一个库，基本的一些需求能够很快地完成，但是有的需求用`vue`去实现，可能还是有点头疼，可能是因为一些api很少使用，所以这些地方也是需要查漏补缺，同时看看别的组件库是怎么封装组件的也能够学到很多东西。

## 查漏补缺

> 在 Vue 里，一个组件本质上是一个拥有预定义选项的一个 Vue 实例。
所有的 Vue 组件都是 Vue 实例，并且接受相同的选项对象 (一些根实例特有的选项除外)。

### 侦听器&计算属性&方法

计算属性依赖于`data`、`props`或其他`computed`的变化而变化，具有缓冲，方法就没有缓冲。

侦听器的应用场景在**数据变化时执行异步或开销较大的操作**。

### v-if&v-else可复用组件

来回切换的，`if`和`else`里面的一些共同的节点会存在复用的情况减少渲染开支，加入属性Key，避免复用。

这里`v-if`和`v-else`切换的时候可以用这种空的`template`来代替`div`

**`v-show`是不支持`template的`**

```js
<template v-if="loginType === 'username'">
  <label>Username</label>
  <input placeholder="Enter your username">
</template>
<template v-else>
  <label>Email</label>
  <input placeholder="Enter your email address">
</template>
```

### 事件处理

> 有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：

```js
<button v-on:click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>
```

### 组件

> 当使用 DOM 作为模板时 (例如，使用 el 选项来把 Vue 实例挂载到一个已有内容的元素上)，你会受到 HTML 本身的一些限制，因为 Vue 只有在浏览器解析、规范化模板之后才能获取其内容。尤其要注意，像 `<ul>`、`<ol>`、`<table>`、`<select>` 这样的元素里允许包含的元素有限制，而另一些像 `<option>` 这样的元素只能出现在某些特定元素的内部。

这个时候用上`is`，其他时候基本用不上。`.vue`没有影响，所以`is`基本没什么卵用。

参考资料：

1. [element UI](https://github.com/ElemeFE/element)

2. [vant](https://github.com/youzan/vant)
