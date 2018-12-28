import { pbkdf2Sync, createHmac } from 'crypto'

const PBKDF2_ROUNDS = 2048
const PBKDF2_LEN = 64
const SALT_PREFIX = 'electrum'

const VERSION_SEED = {
    "PREFIX_STD" : '01',
    "PREFIX_2FA" : '101',
    "PREFIX_SW"  : '100',
}

const pbkdf2_sha512 = (password: string, salt: string): Buffer => {
    return pbkdf2Sync(password, salt, PBKDF2_ROUNDS, PBKDF2_LEN, 'sha512')
}

const hmac_sha512 = (x: string, y: string): string => {
    return createHmac('sha512', x)
        .update(y)
        .digest('hex')
}

export const getMnemonicVersion = (mnemonic: string) => {
    const normalized_mnemonic = normalizeText(mnemonic)
    return hmac_sha512('Seed version', normalized_mnemonic)
}

export const checkMnemonicVersion = (mnemonic: string, version_prefix: string): boolean => {
    const data = getMnemonicVersion(mnemonic)
    return data.startsWith(version_prefix) ? true : false
}

export const validMnemonic = (mnemonic: string): boolean => {
    const data = getMnemonicVersion(mnemonic)
    return Object.keys(VERSION_SEED).map( (k: string): boolean => {
        const prefix = VERSION_SEED[k]
        return data.startsWith(prefix) ? true : false
    }).reduce((r, v) => {
        return v === false ? false : r
    }, true)
}

export const normalizeText = (text: string): string => {
    return text
        .normalize('NFKD')
        .toLowerCase()
        .replace(/\t/g, ' ')
        .split(' ')
        .filter(v => v !== '')
        .join(' ')
}

export const mnemonicToSeed = (mnemonic: string, passphrase: string = ''): Buffer => {
    const mnemonic_ = normalizeText(mnemonic)
    const passphrase_ = normalizeText(passphrase)
    return pbkdf2_sha512(mnemonic_, SALT_PREFIX + passphrase_)
}

export const mnemonicToSeedHex = (mnemonic: string, passphrase: string = ''): string => {
    const seed = mnemonicToSeed(mnemonic, passphrase)
    return seed.toString('hex')
}


const words = "wild father tree among universe such mobile favorite target dynamic credit identify"
console.log(validMnemonic(words))
