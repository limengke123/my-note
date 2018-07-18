# 前端部署nginx配置

之前很少接触前端项目的部署，这次为了更全面的学习就在本机上装了一个虚拟机上，在虚拟机上练习了如何把一个 `react` 写的 `spa` 项目部署到这个虚拟机的服务器上。由于 `linux` 也是刚接触不久，所以整个过程还是遇到了很多坑，这里记录下。

## 目标

我有一个用 `react` 写的单页面应用，然后希望部署到服务器上，通过 `ip` 如 `192.168.1.240/config` 这种路径下访问到我的应用。这个 `react` 项目依赖一个 `node.js` 的一个 `api` 服务，我需要在 `nginx` 上配置代理使得我的 `react` 应用能够访问到我的 `api` 服务。

## 准备

首先要准备的就是打包好的的 `react` 应用，然后在服务器上装一个 `nginx` 和一个 `node.js`。

针对我这个项目, 我把 `react` 打包好的项目全部放到了 `/root/html/pageConfig` 这个路径下。

## nginx配置

修改 `nginx` 安装目录下的 `./conf/nginx.conf` 文件：

``` conf
#user nodody;
# 1. 由于我的 react 项目打包出来放在 root 目录下，需要设置user 为 root 时内容才能够被访问
user root;

worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        # 2. 对我的/api请求转发到8989端口下node.js服务
        location /api {
            proxy_pass  http://127.0.0.1:8989;
        }
        # 3. 在/config下的请求都指向到我放在root下的configPage里的内容
         location /config {
            alias /root/html/configPage;
            index index.html index.htm;
            #rewrite /config  /root/html/configPage/index.html;
            try_files $uri $uri/ /config/index.html;
         }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
```

这里就是只修改了默认配置文件的三个地方，来满足我的要求：

1. 修改 `user` 为 `root`，使得 `root` 下的内容能够被访问
2. 新增 `location /api` 设置 `proxy_pass` 使得 `/api`下的请求都被转发到 `proxy_pass` 设置的 `node.js` 服务处,满足我的前端页面 `api` 接口代理的问题
3. 新增 `location /config` 的配置，使得 `/config` 下请求都转发至我 `react` 打包文件所在的路径。这样我访问 `192.168.1.240/config`就能看到我的页面。*这里我当初是复制的`location /` 的配置，用的也是 `root` 指向路径，结果一直不行，查了资料，发现应该要写成 `alias` 才行*

这里的配置文件可能需要更改多次，才能成功，需要注意的是，每次修改完 `nginx` 配置，需要重启下 `nginx`:

```bash
nginx -s reload
```

## 静态资源路径问题

把打包好的文件传到服务器上的时候，可能出现静态资源文件找不到的情况。

### 资源路径找不到的原因

可能的原因是当 `react` 应用打包的时候，生成 `index.html` 文件中插入 `style` 和 `script` 标签的路径不对，从而找不到静态资源。

### 静态资源找不到的解决方法

需要在 `webpack` 的配置文件中去修改一下 `publicPath` 这个属性，这个属性会影响你的静态资源文件插入到 `index.html` 中的路径。像我这个项目设置 `publicPath: './'`就可以了，具体可以多修改几次多打包几次试试就行了。

## 前端路由

### 前端路由分类

前端路由分为两种实现，一种就是 `hashRouter`，另一种就是用 `H5` 新的 `History API` 实现的 `browserRouter`。由于 `hashRouter` 的路径带一个 `#` 不是特别好看，一般还是用 `browserRouter` 较多。

### 前端路由的问题

前端路由说白了就是路径变了，不去请求服务器，而是用 `js` 去改变页面的方式。这样的话，用 `browserRouter` 的话这里就存在一个问题，我用前端路由跳转到某一个路径下 `/xxx`，这是我刷新页面，这时候就会去服务器上拿资源，这个前端路由路径下肯定找不到资源，所以就会出现 `404` 报错。

### 解决方案

解决页面刷新 `404` 这个问题，只需要把所有的请求全部返回 `index.html`，可以搜索 `history fallback` 这个关键词查看相关资料。

针对我的这个 `nginx` 配置而言，只需要加入 `try_files $uri $uri/ /config/index.html;`,就能把前端路由路径发送给服务器时全部返回 `index.html`，这样就解决了 `404`问题。

## Route路径匹配问题

配置好上述的 `nginx` 以及把打包好的文件放到对应的目录，再把我的 `api` 服务启动，再访问 `192.168.1.240/config` 时，已经能够正常的显示页面，并且接口也能正常代理请求到了。但是涉及到路由的页面却没有被渲染出来。

### Route路径匹配的原因

回想一下，在 `react-router-dom` 的 `Route` 标签里传递一个 `path={'/xx'}` 的属性时，前端路由会根据这个 `path` 来渲染对应的 `Route` 上传递过去的 `Component` 组件。那么在我的 `nginx` 的设置中，我设置的是 `location /config`，也就是说我实际访问路径都是加上了前缀 `/config`，所以每个 `Route` 标签中传过去的路径都因为缺少了 `/config` 前缀导致所以的匹配都不成立，所以 `Route` 的页面都没有办法渲染。

### Route路径匹配修改方法

方法很简单，在 `BrowserRouter` 上加一个 `basename` 的属性，给这属性传递 `config` (*具体是什么值，依据你给 `nginx`设置 `location` 时的前缀，我的例子中是 `config`*)，这样 `Route` 在匹配路径的时候会加上 `basename`，这样就能和对应路径匹配上，然后渲染对应页面。

## 总结

对 `linux` 不熟悉，`nginx` 也不熟悉，依靠着百度，摸爬滚打尝试修改了好多次 `nginx` 配置，终于能够 `react` 打包好的文件部署上去了， `vue` 项目的部署也是没什么区别的。
