const http = require('http')
const net = require('net')

;(function () {
    return false
    const server = http.createServer((req, res) => {
        const url = req.url
        res.end(`访问的地址:${url}`)
    })
    server.listen(3001, () => {
        console.log(`started on 3001`)
    })

    const client = http.get('http://127.0.0.1:3001', res => {
        res.pipe(process.stdout)
    })
})()

;(function () {
    const PORT = 8989
    const HOST = '127.0.0.1'
    const server = net.createServer(socket => {
        console.log(`connect ${socket.remoteAddress}: ${socket.remotePort}`)
        socket.on('data', data => {
            console.log(`DATA ${socket.remoteAddress}: ${data}`)
            console.log(`DATA IS : ${data}`)
            socket.write(`data from you is ${data}`)
        })
        socket.on('close', () => {
            console.log(`closed ${socket.remoteAddress}  ${socket.remotePort}`)
        })
    })
    server.listen(PORT, HOST)
    console.log(server instanceof net.Server)
})()
