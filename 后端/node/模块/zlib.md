# zlib

服务端和浏览器交互的时候，服务端会把资源`gizp`压缩，然后在`http`响应头里面加上`Accept-Encoding`告诉浏览器用什么算法解压资源。

> Accept-Encoding: gzip, deflate

`node`中就是用`zlib`模块做压缩的事情。
