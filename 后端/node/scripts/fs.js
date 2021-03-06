const fs = require('fs')
const path = require('path')
const filepath = './extra/fileForCompress.txt'

;(function normal () {
    /**
     * 同步读取文件
     * */
    return false
    let data
    try {
        data = fs.readFileSync(filepath, 'utf8')
        console.log(data)
    } catch (e) {
        console.error(`读取文件失败${e.message}`)
    }
})()

;(function asyncRead() {
    /**
     * 异步读取
     * */
    return false
    fs.readFile(filepath, 'utf8', (err, data) => {
        if (err) return console.error(`读取文件出错${err.message}`)
        console.log(`文件内容${data}`)
    })
})()

;(function withStream () {
    /**
     * 流式读取
     * 适合读取大文件
     * */
    return false
    const readstream = fs.createReadStream(filepath, 'utf8')
    readstream
        .on('data', chunk => {console.log(`读取数据：${chunk}`)})
        .on('error', err => console.log(`出错${err.message}`))
        .on('end', () => console.log(`end`))
        .on('close', () => console.log(`close`))
})()

;(function writeAsync () {
    /**
     * 异步写入
     * */
    return false
    fs.writeFile('./extra/fileForWrite.txt', 'hello world', 'utf8', err => {
        if (err) throw err
        console.log(`文件写入成功`)
    })
})()

;(function write() {
    /**
     * 同步写入
     */
    return false
    try {
        fs.writeFileSync('./extra/fileForWrite1.txt', 'hello world', 'utf8')
        console.log(`文件写入成功`)
    } catch (e) {
        throw e
    }
})()

;(function writeWithStream() {
    /**
     * 流式写入
     */
    return false
    const writestream = fs.createWriteStream('./extra/fileForWrite3.txt', 'utf8')
    writestream
        .on('close', () => console.log(`关闭`))
    writestream.write('hello')
    writestream.write('world')
    writestream.end('')
})()

;(function stat() {
    /**
     * 文件是否存在
     * fs.exists已经废弃
     * fs.access除了判断文件存在,还可以判断文件权限
     * 备忘：fs.constants.F_OK等常量无法获取（node v6.1，mac 10.11.4下，fs.constants是undefined）
     */
    return false
    fs.access('./extra/fileForCompress.txt', (err) => {
        if (err) throw err
         console.log(`文件1存在`)
    })
    fs.access('./extra/fileNotExist.txt', (err) => {
        if (err) throw err
        console.log(`文件2存在`)
    })
})()

;(function createDir() {
    /**
     * 异步和同步创建目录
     * */
    return false
    fs.mkdir('./hello1', (err) => {
        if (err) throw err
        console.log(`目录创建成功`)
    })

    try {
        fs.mkdirSync('./hello2')
    } catch (e) {
        console.log(e)
    }
})()

;(function removeFileAsync() {
    /**
     * 异步删除文件
     * */
    return false
    fs.unlink('./extra/fileForUnlink.txt', (err) => {
        if (err) throw err
        console.log(`删除成功`)
    })
})()

;(function removeFile() {
    /**
     * 同步删除
     * */
    return false
    try {
        fs.unlinkSync('./extra/fileForUnlink2.txt')
        console.log(`删除成功`)
    } catch (e) {
        console.log(e)
    }
})()

;(function Traverse() {
    /**
     * 遍历目录
     * 同步
     * */
    return false
    const getFilesInDir = (dir) => {
        // let result = []
        let result = [path.resolve(dir)]
        // const files = fs.readdirSync(dir)
        const files = fs.readdirSync(dir, 'utf8')
        files.forEach(file => {
            // 路径需要处理一下
            file = path.resolve(dir, file)
            const stat = fs.statSync(file)
            if (stat.isDirectory()) {
                result = result.concat(getFilesInDir(file))
            } else if (stat.isFile()) {
                result.push(file)
            }
        })
        return result
    }
    const result = getFilesInDir('../')
    console.log(result)
})()

;(function () {
    /**
     * 异步遍历
     * 暂时先不实现,有空看看
     * 结合async/await应该还是比较快的
     * */
})()

;(function rename() {
    /**
     * 文件重命名
     * */
    return false
    fs.rename('./extra/test1.txt', './extra/world.txt', (err) => {
        if (err) throw err
        console.log(`rename is success`)
    })
})()

;(function renameSync() {
    /**
     * 同步修改
     * */
    return false
    fs.renameSync('./extra/test10.txt', './extra/hello.txt')
})()

;(function watch() {
    /**
     * 监听文件变化
     * fs.watch比fs.watchFile高效
     * fs.watchFile用的轮询
     * */
    ;(function () {
        return false
        const options = {
            persistent: true,
            interval: 2000
        }
        fs.watchFile('./fileForWatch.txt', options, ((curr, prev) => {
            console.log(`修改时间为${curr.mtime}`)
        }))
    })()

    ;(function () {
        /**
         * fs.watch接口有问题
         * 各个平台行为不一样
         * */
        return false
        let options = {
            persistent: true,
            recursive: true,
            encoding: 'utf8'
        }

        fs.watch('../', options, function(event, filename){
            console.log('触发事件:' + event)
            if(filename){
                console.log('文件名是: ' + filename)
            }else{
                console.log('文件名是没有提供')
            }
        })

    })()


})()

;(function chown() {
    /**
     * 修改所有者
     * fs.chown
     * fs.chownSync
     * */
})()

;(function chmod() {
    /**
     * 修改权限
     *
     * 可以用fs.chmod()，也可以用fs.fchmod()。两者的区别在于，前面传的是文件路径，后面传的的文件句柄。
     * fs.chmod)、fs.fchmod()区别：传的是文件路径，还是文件句柄。
     * fs.chmod()、fs.lchmod()区别：如果文件是软连接，那么fs.chmod()修改的是软连接指向的目标文件；fs.lchmod()修改的是软连接。
     * */
})()

;(function stat() {
    /**
     * 获取文件状态
     * fs.stat() vs fs.fstat()：传文件路径 vs 文件句柄。
     * fs.stat() vs fs.lstat()：如果文件是软链接，那么fs.stat()返回目标文件的状态，fs.lstat()返回软链接本身的状态。
     * 返回值stats
     * stats.isFile() -- 是否文件
     * stats.isDirectory() -- 是否目录
     * stats.isBlockDevice() -- 什么鬼
     * stats.isCharacterDevice() -- 什么鬼
     * stats.isSymbolicLink() (only valid with fs.lstat()) -- 什么鬼
     * stats.isFIFO() -- 什么鬼
     * stats.isSocket() -- 是不是socket文件
     * */
})()

;(function access() {
    /**
     * 访问权限
     * */
    return false
    fs.access('./fileForAccess.txt', function(err){
        if(err) throw err;
        console.log('可以访问');
    });
})()

;(function () {
    /**
     * 同步访问方法
     * */
    // 如果成功，则返回undefined，如果失败，则抛出错误（什么鬼）
    return false
    try{
        fs.accessSync('./fileForAccess.txt');
    }catch(e){
        throw(e);
    }
})()

;(function open() {
    /**
     * 文件打开/关闭
     * flags：文件打开模式，比如r、r+、w、w+等。可选模式非常多。
     * mode：默认是666，可读+可写。
     * fs.open(path, flags[, mode], callback) fs.openSync(path, flags[, mode]) fs.close(fd, callback) fs.closeSync(fd)
     * */
})()





















