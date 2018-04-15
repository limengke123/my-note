# vue与react组件对比学习

## 前言

我最一开始是先学的`react`，然后也就前段时间开始学习`vue`，一开始给我的感受是两者很相似，`react`给我的感觉是*灵活*，`vue`是一种*死板*的感觉。为什么有这种感觉呢，`react`有一种很强烈的欲望，**all in js**只要能够用够`js`写的，就全用`js`写，所以一切都很灵活，`jsx`很酷，**高阶组件**牛逼，`es7`的装饰器也是可以玩的飞起。反观`vue`，搞的`.vue单文件`还是尽量保留原来前端开发的模式，留下了`template`、`script`、`style`三个最基本的东西，其实内部运作应该还是和`react`类似。

## react

`react`看的各种道听途说的文章，这玩意大概是怎么玩的呢？简单的说`jsx`被解析成`createElement`的方法，里面传到参数啊什么的就是告诉`react`怎么渲染之类，然后方法返回一个`虚拟dom`,大概是这么搞的，具体细节我也不是太懂。

## vue

`vue`一开始让我挺晕的，官网的学习教程和一般写的项目不太一样，官网教程的例子没有单文件，全是在选项对象中加入一个`template`属性，一般的项目开发的都是用的`.vue`的单文件。一开始我是没太理解`.vue`这文件到底是怎么玩，只是按着这样写，不理解原理好像也能够基本完成自己想要的效果。

最近看了一些文章以及看了好几遍官网的`api`，[官网的api](https://cn.vuejs.org/v2/api/)还是很有必要每一个都看一遍的，之前大致看一遍感觉好多东西都没有见到过，别人代码看多了，发现很多没用的`api`还是很强的。下面讲讲我对`vue`的一些理解。

`vue`是怎么玩的呢？每一个`vue`组件都是一个`Vue`实例，这样说也不是很准确，应该每一个自己写的组件都是通过调用`Vue.extend`继承`Vue`后扩展出来的新的类的实例，想一想怎么定义一个`vue`组件，就是调用了`Vue.component`[方法](https://cn.vuejs.org/v2/api/?#Vue-component)，

```js
// 注册组件，传入一个扩展过的构造器
Vue.component('my-component', Vue.extend({ /* ... */ }))

// 注册组件，传入一个选项对象 (自动调用 Vue.extend)
Vue.component('my-component', { /* ... */ })

// 获取注册的组件 (始终返回构造器)
var MyComponent = Vue.component('my-component')
```

一般情况下我们写的`.vue单文件`暴露出来的就是一个选项对象，这个方法的内部自动调用了`Vue.extend`。所以`.vue单文件`本质上是`vue-loader`去把`<template></template>`里的内容转成字符串形式，塞到`<scirpt></script>`里面的`export default {}`的对象里面的`template`去，当然了，这还没有完，`template`属性里面的字符串也可以说是一种糖，`vue`内部是要调用`Vue.compile`去做一次转换，最终把`template`的值转换成`render`，这个属性的值是一个方法，这里就和`react`统一了，用是有个同名的函数`createElement`去生成`Vnode`。所以在选项对象中，可以不给出`template`属性而是给出`render`属性，同时存在`template`和`render`的时候会忽视`template`。

看看[官网](https://cn.vuejs.org/v2/guide/render-function.html)`render`用法：

```js
var getChildrenTextContent = function (children) {
  return children.map(function (node) {
    return node.children
      ? getChildrenTextContent(node.children)
      : node.text
  }).join('')
}

Vue.component('anchored-heading', {
  render: function (createElement) {
    // create kebabCase id
    var headingId = getChildrenTextContent(this.$slots.default)
      .toLowerCase()
      .replace(/\W+/g, '-')
      .replace(/(^\-|\-$)/g, '')

    return createElement(
      'h' + this.level,
      [
        createElement('a', {
          attrs: {
            name: headingId,
            href: '#' + headingId
          }
        }, this.$slots.default)
      ]
    )
  },
  props: {
    level: {
      type: Number,
      required: true
    }
  }
})
```

看的出来这种直接写`render`比起`template`要麻烦的多，所以为了简化这种写法就搞出来了一个`jsx`写法，这里又和`react`又统一了。

`jsx`用法:

```js
import AnchoredHeading from './AnchoredHeading.vue'

new Vue({
  el: '#demo',
  render: function (h) {
    return (
      <AnchoredHeading level={1}>
        <span>Hello</span> world!
      </AnchoredHeading>
    )
  }
})
```

## 一个需求引发的思考

通常我们写`react`和`vue`都是一个写一个组件`customComp`，然后在别的组件要用的时候都是直接`<customComp/>`写进去的，但是有的组件就不能这么做了，比如一个提醒的`message`组件，我希望在`react`中是这样调用，像是一个工具类函数一般使用：

```jsx
import message from 'message.js'
import React from 'react'

class XXXcomponent extends React.Component{
    ...
    componentDidMount(){
        message.info({
            type:'success',
            text:'hello react!'
        })
    }
}


```

在`vue`中我希望是这样的调用的：

```js
{
    mounted(){
        this.$message({
            type:'success',
            text:"hello vue!"
        })
    }
}
```

在看了一些三方库的这种组件的实现方式，来回折腾了一段时间，对`react`和`vue`理解的更深了一些。

### vue的实现

先拿`vue`说，先写一个`message.vue`的组件文件，然后在`index.js`文件中把这个`message.vue`文件`import`进来，你可以试着打印下这个`vue`文件长得什么样，其实前面也分析过了，其实引进来的就是一个选项对象，而且`<template></template>`标签的内容也被弄成了render属性了，前面也铺垫过了`vue.extend`，这里把引入的选项对象传入`vue.extend`中就返回了一个扩展过的`Vue`类了,然后我们手动去`new`一个`message`的组件实例出来，可以传入一个`propsData`就能把数据传给到组件内部的`prop`中去，打印下实例就会发现定义在`.vue`文件中的`data`、`prop`之类的都有，这个时候我们只是实例化了一个实例，其实在`document`上是找不到这个节点的，只需要最后在实例上调用`$mount(el)`，就能把实例挂载到`document`上去了。直接修改实例上`data`里面定义的值，会发现也是响应的，至此这个`message`组件我们能够手动去控制这个组件了，具体细节该怎么暴露出`api`来个外部调用就不说了。

```js
//伪代码
import message from 'message.vue'
import Vue from 'vue'

const Constructor = Vue.extend(message) //扩展出一个新的类

const options = {
    innerProps:"inner props"
}

const instance = new Constructor({propsData:options})  //创建一个实例，也可以传给一个props

instance.$mount(document.body) //组件挂在body下

//如果组件内部methods有方法，实例就能直接调用

// instance.innerFunction()

```

### react实现

大体上是和`vue`类似，有几个地方有变化，引进来的组件，因为是用`class extends React.Component`的形式写的，看的出来已经是扩展过`react`后组件类了，直接去`new`就能拿到实例了,或者是用`React.createElement`传入组件拿到`虚拟dom`。和`vue`不同的事，`vue`有个`$mount`方法帮助挂载组件到指定的位置，在`react`中要用到`react-dom`里面的`render`方法，传入前面拿到的`虚拟dom`以及要挂载的位置，这个方法会返回这个组件实例，这个时候就可以调用组件实例的`setState`方法去做一些事情了。

## 总结

`react`、`vue`随便用用带还是挺简单的，我的观点是`api文档`只能教会你**70%**的东西，但是你有了这**70%**的功力，大部分的东西基本都没什么问题，但是文档之外的**30%**，往往是最难学的，可能需要剥开`vue`、`react`简单易用的外表，来回看官方文档，每次都能有新的体会，翻看第三方优秀的组件库是最佳学习的方案，深入地去理解内部原理才能真正的掌握。

这种组件函数式用法在我的[fantastic-carnival(一个博客系统)](https://github.com/limengke123/fantastic-carnival)中有体现：
其中有一个`loadingBar`组件是一个加载条的组件，参考的是`iview`组件库中的`vue`实现，同时我用`react`也实现了一遍。

* [vue的loadingBar实现](https://github.com/limengke123/fantastic-carnival/tree/master/admin/src/components/general/loading-bar)
* [vue的message实现](https://github.com/limengke123/fantastic-carnival/tree/master/admin/src/components/general/message)
* [react的lonadingBar实现](https://github.com/limengke123/fantastic-carnival/tree/master/client/src/components/common/loading-bar)

## 参考资料

1. [vue组件思考](https://nlush.com/blog/2017/10/14/VUE-%E7%BB%84%E4%BB%B6%E7%9A%84%E4%B8%80%E7%82%B9%E6%80%9D%E8%80%83/)
2. [vue官网渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)