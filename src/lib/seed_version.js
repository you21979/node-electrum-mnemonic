'use strict'

const crypto = require('crypto')
const mutil = require('./mnemonic_utils')
const mnemonic_v1 = require('./mnemonic_v1')

const VERSION_SEED = {
    "PREFIX_STD" : '01',
    "PREFIX_2FA" : '101',
    "PREFIX_SW"  : '100',
}

const hmac_sha512 = (x, y) => crypto.createHmac('sha512', x).update(y).digest('hex')

const is_new_seed = (mnemonic, prefix) => {
    const normalized_mnemonic = mutil.normalizeText(mnemonic)
    const s = hmac_sha512('Seed version', normalized_mnemonic)
    return s.startsWith(prefix)
}

const seed_prefix = (seed_type) => {
    switch(seed_type){
    case 'standard':
        return VERSION_SEED.PREFIX_STD
    case 'segwit':
        return VERSION_SEED.PREFIX_SW
    case '2fa':
        return VERSION_SEED.PREFIX_2FA
    }
}

const is_old_seed = (mnemonic) => {
    let uses_electrum_words = false
    let is_hex = false
    const normalized_mnemonic = mutil.normalizeText(mnemonic)

    const words = normalized_mnemonic.split(' ')
    try{
        const x = mnemonic_v1.mn_decode(words)
        console.log(x)
        uses_electrum_words = true
    }catch(e){
        uses_electrum_words = false
    }

    // 単純にヘックスかどうか
    try{
        const seed = new Buffer(normalized_mnemonic)
        is_hex = (seed.length === 16 || seed.length === 32)
    }catch(e){
        is_hex = false
    }
    return is_hex || (uses_electrum_words && (words.length === 12 || words.length === 24))
}

const seed_type = (x) => {
    if(is_old_seed(x)){
        return 'old'
    }else if(is_new_seed(x, VERSION_SEED.PREFIX_STD)){
        return 'standard'
    }else if(is_new_seed(x, VERSION_SEED.PREFIX_SW)){
        return 'segwit'
    }else if(is_new_seed(x, VERSION_SEED.PREFIX_2FA)){
        return '2fa'
    }
    return ''
}


exports.seed_type = seed_type
