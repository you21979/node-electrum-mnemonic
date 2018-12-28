import * as assert from 'assert'
import { mnemonicToSeedHex } from '../lib/electrum_seed'

describe('normal test', () => {
    const seedhex = 'aac2a6302e48577ab4b46f23dbae0774e2e62c796f797d0a1b5faeb528301e3064342dafb79069e7c4c6b8c38ae11d7a973bec0d4f70626f8cc5184a8d0b0756'
    const words = "wild father tree among universe such mobile favorite target dynamic credit identify"

    it('test', () => {
        const result: string = mnemonicToSeedHex(words)
        assert(result === seedhex)
    })
})

