'use strict'

const normalizeText = (text) => {
    let seed = text.normalize('NFKD').toLowerCase()
 //   seed = seed.split('').map( v => v).join('')
    seed = seed.replace(/\t/g, ' ').split(' ').filter(v => v !== '').join(' ')
    return seed
}

exports.normalizeText = normalizeText
