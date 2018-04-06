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

~~这个时候用上`is`，其他时候基本用不上。`.vue`没有影响，所以`is`基本没什么卵用。~~
这个`is`好像还是很有用的...，配合`conponent`组件好像能搞出大事情，后续文章这块会有再介绍用法。

#### 自定义事件的表单输入组件

表单输入是业务中太常见的需求了，具体怎么搞，得深入理解下：

> `v-model`是语法糖

```js
<input v-model="something">
```

是以下示例的语法糖：

```js
<input
  v-bind:value="something"
  v-on:input="something = $event.target.value">
```

所以在组件中使用时，它相当于下面的简写：

```js
<custom-input
  v-bind:value="something"
  v-on:input="something = arguments[0]">
</custom-input>
```

所以要让组件的 v-model 生效:

* 接受一个`value`prop
* 在有新的值时候触发`input`事件并将新的值作为参数

官网例子：

```js
<currency-input v-model="price"></currency-input>
```

```js
Vue.component('currency-input', {
  template: '\
    <span>\
      $\
      <input\
        ref="input"\
        v-bind:value="value"\
        v-on:input="updateValue($event.target.value)"\
      >\
    </span>\
  ',
  props: ['value'],
  methods: {
    // 不是直接更新值，而是使用此方法来对输入值进行格式化和位数限制
    updateValue: function (value) {
      var formattedValue = value
        // 删除两侧的空格符
        .trim()
        // 保留 2 位小数
        .slice(
          0,
          value.indexOf('.') === -1
            ? value.length
            : value.indexOf('.') + 3
        )
      // 如果值尚不合规，则手动覆盖为合规的值
      if (formattedValue !== value) {
        this.$refs.input.value = formattedValue
      }
      // 通过 input 事件带出数值
      this.$emit('input', Number(formattedValue))
    }
  }
})
```

#### 非父子组件通信

官方给了一种比较奇怪的做法，实例化一个Vue实例，专门用来实现事件监听的空壳：

```js
var bus = new Vue()
```

```js
bus.$emit(`id-select`,1)
```

```js
bus.$on('id-selected',function(id){})
```

这种方案，不清楚在`vue单文件`模式下如何使用。

### 插槽slot

写这篇文章最主要的目的可能就是因为这个插槽，之前过了一遍文档，这块一带而过，没有深入理解，现在遇到需要实现`tooltip`等组件时，发现`element ui`在插槽在[tooltip](https://github.com/ElemeFE/element/tree/dev/packages/tooltip)这一块就是用的`slot`，所以还是很有必要回过头好好学一下这个东西。

先看官网定义，虽然官网这一块写的不是特别容易懂:

自定义组件内部再套一个组件或是一个普通dom节点是插槽解决的问题，`vue`中的叫法叫做`内容分发`，在`React`中好像直接用`this.props.children`就能搞定，`React`在某些地方确实很灵活也比较容易理解：

```html
<app>
  <app-header></app-header>
  <app-footer></app-footer>
</app>
```

* 编译作用域

> 父组件模板的内容在父组件作用域内编译；子组件模板的内容在子组件作用域内编译。
* 单个插槽

子组件至少包含一个`<slot>`插口，否则父组件的内容将会被**丢弃**。
当子组件模板只有一个没有属性的插槽时，父组件传入的整个内容片段将插入到插槽所在的 `DOM` 位置，并替换掉插槽标签本身。

例子也简单，贴一下吧：

```js
//这是子组件my-component
<div>
  <h2>我是子组件的标题</h2>
  <slot>
    只有在没有要分发的内容时才会显示。
  </slot>
</div>
```

```js
//父组件调用子组件
<div>
  <h1>我是父组件的标题</h1>
  <my-component>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </my-component>
</div>
```

```js
//结果
<div>
  <h1>我是父组件的标题</h1>
  <div>
    <h2>我是子组件的标题</h2>
    <p>这是一些初始内容</p>
    <p>这是更多的初始内容</p>
  </div>
</div>
```

* 具名插槽

> `<slot>` 元素可以用一个特殊的特性 `name` 来进一步配置如何分发内容。多个插槽可以有不同的名字。具名插槽将匹配内容片段中有对应 `slot` 特性的元素。仍然可以有一个`匿名插槽`，它是`默认插槽`，作为找不到匹配的内容片段的备用插槽。如果没有`默认插槽`，这些找不到匹配的内容片段将被抛弃。

继续看例子，也没有什么难度：

```js
//一个布局组件app-layout
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```

```js
//父组件去调用这个组件的时候
<app-layout>
  <h1 slot="header">这里可能是一个页面标题</h1>

  <p>主要内容的一个段落。</p>
  <p>另一个主要段落。</p>

  <p slot="footer">这里有一些联系信息</p>
</app-layout>
```

```js
//结果
<div class="container">
  <header>
    <h1>这里可能是一个页面标题</h1>
  </header>
  <main>
    <p>主要内容的一个段落。</p>
    <p>另一个主要段落。</p>
  </main>
  <footer>
    <p>这里有一些联系信息</p>
  </footer>
</div>
```

* 作用域插槽

~~这里就是看不太懂的地方，先留一个坑。~~
看了一圈看的差不多明白了，放一个官网例子：

```js
//子组件
<div class="child">
  <slot text="hello from child"></slot>
</div>
```

```js
//父组件
<div class="parent">
  <child>
    <template slot-scope="props">
      <span>hello from parent</span>
      <span>{{ props.text }}</span>
    </template>
  </child>
</div>
```

```js
//結果
<div class="parent">
  <div class="child">
    <span>hello from parent</span>
    <span>hello from child</span>
  </div>
</div>
```

什么意思呢，子组件的内容可以传递到父组件上去给父组件用，例子中在自组建的`slot`上挂了一个`text`属性，然后父组件在`template`上声明一个`slot-scope`属性，通过这个属性的值就可以访问到自组件想要给父组件的值，有点绕，看起来很灵活很有用，但是实际应用场景应该不多。

* 动态组件

> 通过使用保留的 `<component>` 元素，并对其 `is` 特性进行动态绑定，你可以在同一个挂载点动态切换多个组件：

感觉简单的一个可切换card页面可以用这种方法解决：

```js
var vm = new Vue({
  el: '#example',
  data: {
    currentView: 'home'
  },
  components: {
    home: { /* ... */ },
    posts: { /* ... */ },
    archive: { /* ... */ }
  }
})
```

```js
<component v-bind:is="currentView">
  <!-- 组件在 vm.currentview 变化时改变！ -->
</component>
```

```js
var Home = {
  template: '<p>Welcome home!</p>'
}

var vm = new Vue({
  el: '#example',
  data: {
    currentView: Home
  }
})
```

* keep-alive

这种专门针对切换可以缓冲组件。

```js
<keep-alive>
  <component :is="currentView">
    <!-- 非活动组件将被缓存！ -->
  </component>
</keep-alive>
```

### 自定义指令

> 有的情况下，你仍然需要对**普通 `DOM` 元素**进行底层操作，这时候就会用到自定义指令

官网的这个例子很好,组件在加载完自动focus：

```js
// 注册一个全局自定义指令 `v-focus`
Vue.directive('focus', {
  // 当被绑定的元素插入到 DOM 中时……
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

```js
//调用
  <input v-focus>
```

几个钩子函数：

1. bind 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
2. inserted 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。
3. update 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新。
4. componentUpdated 指令所在组件的 VNode 及其子 VNode 全部更新后调用。
5. unbind 只调用一次，指令与元素解绑时调用。

钩子函数的参数：

* el  指令所绑定的元素，可以用来直接操作 DOM
* binding
  * name 指令名，不包括 `v-` 前缀。
  * value 指令的绑定值
  * oldValue 指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。
  * expression 字符串形式的指令表达式。
  * arg 传给指令的参数，可选。
  * modifiers 一个包含修饰符的对象。
* vnode Vue 编译生成的虚拟节点。
* oldVnode 上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

比较重要的也就`el`和`binding`，用`binding`里的`value`可以给`el`用。

> 除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 `dataset` 来进行。

---

## 补充

2018/4/6：

最近看了一些别人组件一些用法，感觉学的`vue`还是比较皮毛的，有空再写一篇`vue`的较为高级用法。

---

参考资料：

1. [element UI](https://github.com/ElemeFE/element)

2. [vant](https://github.com/youzan/vant)

3. [vue组件思考](https://nlush.com/blog/2017/10/14/VUE-%E7%BB%84%E4%BB%B6%E7%9A%84%E4%B8%80%E7%82%B9%E6%80%9D%E8%80%83/)

我的相关项目：

* [fantastic-carnival](https://github.com/limengke123/fantastic-carnival) 一个前后端都有的博客

* [md-editor](https://github.com/limengke123/md-editor) markdown的编辑器
