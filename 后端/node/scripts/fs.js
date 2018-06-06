const fs = require('fs')
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
    return false
    try {
        fs.writeFileSync('./extra/fileForWrite1.txt', 'hello world', 'utf8')
        console.log(`文件写入成功`)
    } catch (e) {
        throw e
    }
})()

;(function writeWithStream() {
    const writestream = fs.createWriteStream('./extra/fileForWrite3.txt', 'utf8')
    writestream
        .on('close', () => console.log(`关闭`))
    writestream.write('hello')
    writestream.write('world')
    writestream.end('')
})()