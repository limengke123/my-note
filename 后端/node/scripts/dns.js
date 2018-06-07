const dns = require('dns')

;(function dnstest() {
    /**
     * 拿到ip
     * */
    return false
    dns.lookup('www.qq.com', (err, address, family) => {
        if (err) throw err
        console.log(`例子A: ${address}`)
    })
})()

;(function () {
    /**
     * 同一个域名，可能对应多个不同的ip。那么，如何获取一个域名对应的多个ip呢？
     * */
    return false
    let options = {
        all: true
    }
    dns.lookup('www.qq.com', options, (err, address, family) => {
        if (err) throw err
        console.log(`例子B:${address.map(console.log)}`)
    })
})()

;(function () {
    /**
     * 也可以通过 dns.resolve4() 来实现。
     * */
    return false
    dns.resolve4('id.qq.com', (err, address) => {
        if (err) throw err
        console.log(address)
    })
})()

;(function () {
    /**
     * 两个方法都可以查询域名的ip列表。那么，它们的区别在什么地方
     * 可能最大的差异就在于，当配置了本地Host时，是否会对查询结果产生影响。
     * dns.lookup()：有影响。
     * dns.resolve4()：没有影响。
     * 假设 127.0.0.1 www.qq.com
     * */

    dns.lookup('www.qq.com', function(err, address, family){
        if(err) throw err
        console.log('配置host后，dns.lokup =>' + address)
    })

    dns.resolve4('www.qq.com', function(err, address, family){
        if(err) throw err
        console.log('配置host后，dns.resolve4 =>' + address)
    })
})()


