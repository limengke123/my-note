# vue、react隐式实例化

> 写这篇的缘由是因为上一篇[vue与react组件对比学习](https://github.com/limengke123/my-note/blob/master/%E5%89%8D%E7%AB%AF/vue%E4%B8%8Ereact%E7%BB%84%E4%BB%B6%E5%AF%B9%E6%AF%94%E5%AD%A6%E4%B9%A0.md)写的有点啰嗦也没有写的很明白同时也存在一点错误，所以重新写一篇简介概要点的。

## 隐式实例化

> 隐式实例化，不希望写在`react`的`jsx`里或是`vue`的`template`，而是希望通过手动去实例化一个`react`或是`vue`组件。

说的有点绕，这种*隐式实例化*的应用场景在提示信息(message)、模态框(modal)、加载条(loadingbar)，例如一个`ajax`请求，在成功或失败的时候需要给一个提示：

```js
// 下面是伪代码...

import message from 'message'

fetch('/api/xxx')
    .then(resp => {
        if(resp.success === true){
            message({
                type:"success",
                text:"请求成功"
            })
        } else {
            message({
                type:"error",
                text:"请求出错"
            })
        }
    })

```

可以看的出来，我们的需求是想有一个组件能像`html`原生的`alert`一样，在需要的地方能够直接去调用，而不是需要把`message`组件写进节点中。

## 难点

我们都知道不论是`react`、还是`vue`也好，写的都是一个类或者叫构造器：

```js

// react 引用代码省略

export default class Message extends React.Component{}

// vue
// export default {
    data(){},
    props:{},
    methods:{},
    render:function(){}
}


```

`react`相当明显地创建了一个`class`，`vue`表面上好像只是暴露一个对象，实际上`vue`的组件被使用时，你需要把子组件传入父组件的`component`的对象中，所以`Vue`会调用`Vue.extend({...自组建的选项对象})`，这个方法就返回了一个构造器。

既然知道了子组件是一个构造器，那我能不能直接去手动`new`一个子组件呢？在我测试下来，好像是不行。

## vue实例化

那么如何实例化呢？分成两部分，先是实例化一个组件，然后再把实例化后的组件挂载到html中去。先拿`vue`说：

### 拿到构造器

```js
import Vue from 'vue'
import message from './message.vue'

// 注意： 这里的message仅仅就是一个对象，需要转成构造器

const messageConstructor = Vue.extend(message)


```

### 实例化

```js
const customProps = {
    // 传给组件的一些props
}


// 这样就能拿到了一个vue组件的实例，就能做很多事情了，比如调用实例中写好的methods中的方法，当然这还没完，我们还得把实例挂载到Html中
const messageInstance = new messageConstuctor({propsData:customProps})
```

### 挂载

`vue`的实例有一个很重要的方法：`$mount`，在选项对象中我们没有传入`el`属性，所以你在这里手动实例化的`vue`实例是没有挂载出来的，需要手动调用一遍`$mount`，可以传入一个DOM节点做为挂载节点，当然也可以不传入参数，后面手动用`dom`方法把节点插入。

```js

// 这里返回的messageWithDom依然还是vue实例而不是dom节点，但是这个实例多了一个$el属性，这个属性里面就藏着我们需要挂载的dom节点
const messageWithDom = messageInstance.$mount()

const dom = messageWithDom.$el

document.body.appendChild(dom)

```

### 野路子

`vue`隐式化实例，基本是这个套路，当然我在看*iview组件库*中用了一些其他的野路子，这里也贴一下：

```js

import Notification from './notification.vue';
import Vue from 'vue';

const _props = properties || {};

const Instance = new Vue({
    render (h) {
        return h(Notification, {
            props: _props
        });
    }
});

```

道理基本上和我说的差不多，不过调用`Vue.extend`更加容易理解。

### 后续控制

拿到组件的实例后，基本上想怎么玩就能怎么玩了，比如说控制隐藏或显示，可以在组件内部定义一个`isShow`的`data`属性，在实例上可以这样用：

```js

if( xxxx ) {
    messageWithDom.isShow = true
} else {
    messageWithDom.isShow = false
}

```

## react实例化

`react`的实例化和`vue`稍稍不同，首先引进来的直接就是一个类所以不需要像`Vue`一样多做一步转换成构造器，其次`react`是没有类似`vue`的`$mount`方法，这也是我一开始很疑惑的地方，后来突然想起来`react`把组件的挂载方法放到了`reactDom`这个包里面了。

### 创建一个虚拟dom

这里需要调用`React.createElement`去创建一个虚拟dom，其实`vue`也能创建一个虚拟dom，参考上面`iview`的野路子。

```js
import React from 'react'
import Message from './message.jsx'

const customProps = {
    // 传给自组件的一些props
}

const Vnode = React.createElment(Message,{props:customProps})

```

### 挂载并且拿到实例

`react`没有`$mount`方法，而是直接调用`reactDom`的`render`方法，相当于`vue`的两步直接一步完成:

```js
import React from 'react'
import ReactDom from 'react-dom'

const containner = document.createElement('div')
document.body.appendChild(containner)

// 把虚拟dom传入reactDom.render方法中，第二个参数是挂载的节点，并返回这个组件的实例
const messageInstance = ReactDom.render(Vnode,containner)
```

### 后续的控制

拿到组件的实例后，基本想怎么玩就能怎么玩了，但是**别忘记了！！！**，`react`修改`state`是调用`setState`，而不像`vue`直接修改。

## 总结

学会隐式化创建实例能够很好的看清楚`vue`和`react`内部的细节，对提高`vue`、`react`大有好处。我的一个项目有个加载条的组件，同时用`react`和`vue`都实现了一遍，可以对比学习发现两者的差异，喜欢的可以点个赞~~。

* [loadingBar的vue实现](https://github.com/limengke123/fantastic-carnival/blob/master/admin/src/components/general/loading-bar/loading-bar.js#L6)
* [loadingBar的react实现](https://github.com/limengke123/fantastic-carnival/blob/master/client/src/components/common/loading-bar/loading-bar.js#L7)