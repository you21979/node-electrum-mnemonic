'use strict'

/*
def mn_decode( wlist ):
    out = ''
    for i in range(len(wlist)//3):
        word1, word2, word3 = wlist[3*i:3*i+3]
        w1 =  wlist.index(word1)
        w2 = (wlist.index(word2))%n
        w3 = (wlist.index(word3))%n
        x = w1 +n*((w2-w1)%n) +n*n*((w3-w2)%n)
        out += '%08x'%x
    return out
*/
const range = (n) => Array.from(Array(n), (v,k) => k)

const n = 1626

const mn_decode = (wlist) => {
    let out = ''
    range(wlist.length / 3 | 0).forEach(i => {
        const [word1, word2, word3] = wlist.slice(3*i, 3*i+3)
        const w1 = wlist.indexOf(word1)
        const w2 = wlist.indexOf(word2) % n
        const w3 = wlist.indexOf(word3) % n
        const x = w1 + n * ((w2 - w1) % n) + n * n * (( w3 - w2 ) % n)
        const buff = new Buffer(4)
        buff.writeInt32BE(x, 0)
        out += buff.toString("hex")
    })
    return out
}


exports.mn_decode = mn_decode



