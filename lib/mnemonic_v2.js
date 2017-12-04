'use strict'

const crypto = require('crypto')
const mutil = require('./mnemonic_utils')

const PBKDF2_ROUNDS = 2048
const PBKDF2_LEN = 64
const pbkdf2_sha512 = (password, salt) => crypto.pbkdf2Sync(password, salt, PBKDF2_ROUNDS, PBKDF2_LEN, 'sha512')
const SALT_PREFIX = 'electrum'

const mnemonicToSeed = (mnemonic, passphrase) => {
    const mnemonic_ = mutil.normalizeText(mnemonic)
    const passphrase_ = mutil.normalizeText(passphrase || '')
    const seed = pbkdf2_sha512(mnemonic_, SALT_PREFIX + passphrase_)
    return seed
}

const mnemonicToSeedHex = (mnemonic, passphrase) => {
    const seed = mnemonicToSeed(mnemonic, passphrase)
    return seed.toString('hex')
}

exports.mnemonicToSeed = mnemonicToSeed
exports.mnemonicToSeedHex = mnemonicToSeedHex
