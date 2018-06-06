const fs = require('fs')
const zlib = require('zlib')
const http = require('http')
const filepath = './extra/fileForGzip.html'

const gzip = zlib.createGzip()
const gunzip = zlib.createGunzip()

;(function compress () {
    /**
     * 这里是压缩的代码
     * */
    return false

    const inFile = fs.createReadStream('./extra/fileForCompress.txt')
    const out = fs.createWriteStream('./extra/fileForCompress.txt.gz')

    inFile.pipe(gzip).pipe(out)
})()

;(function unCompress () {
    /**
     * 这里是解压的代码
     * */
    return false
    const inFile = fs.createReadStream('./extra/fileForCompress.txt.gz')
    const outFile = fs.createWriteStream('./extra/fileForCompress1.txt')
    inFile.pipe(gunzip).pipe(outFile)
})()

;(function httpCompress () {
    /**
     * 服务端gzip压缩
     * */
    return false
    const server = http.createServer((req, res) => {
        const acceptEncoding = req.headers['accept-encoding']
        let gzip

        if (!!~acceptEncoding.indexOf('gzip')) {
            gzip = zlib.createGzip()
            res.writeHead(200, {
                'Content-Encoding': 'gzip'
            })
            fs.createReadStream(filepath).pipe(gzip).pipe(res)
        } else {
            fs.createReadStream(filepath).pipe(res)
        }
    })
    server.listen(3000, () => console.log(`server is started on 3000!`))
})()

;(function httpStrCompress () {
    const responseText = 'hello gzip!!!'
    const server = http.createServer((req, res) => {
        const acceptEncoding = req.headers['accept-encoding']
        if(!!~acceptEncoding.indexOf('gzip')) {
            res.writeHead(200, {
                'content-encoding': 'gzip'
            })
            res.end(zlib.gzipSync(responseText))
        } else {
            res.end(responseText)
        }
    })
    server.listen(3001, () => console.log(`server started on 3001`))
})()


