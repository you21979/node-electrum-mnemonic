'use strict'

const crypto = require('crypto')
const mutil = require('./mnemonic_utils')

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
    return false
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
