# fs

## 相对底层的接口

> fs.write(fd, buffer, offset, length[, position], callback) fs.write(fd, data[, position[, encoding]], callback) fs.writeSync(fd, buffer, offset, length[, position]) fs.writeSync(fd, data[, position[, encoding]])

* fd：写入的文件句柄。
* buffer：写入的内容。
* offset：将buffer从offset位置开始，长度为length的内容写入。
* length：写入的buffer内容的长度。
* position：从打开文件的position处写入。
* callback：参数为 (err, written, buffer)。written表示有xx字节的buffer被写入。

> 备注：fs.write(fd, buffer, offset, length[, position], callback)跟fs.write(fd, data[, position[, encoding]], callback)的区别在于：后面的只能把所有的data写入，而前面的可以写入指定的data子串？