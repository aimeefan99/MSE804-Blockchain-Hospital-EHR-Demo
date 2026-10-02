// Wallet-signature login: proves the caller owns an address, then issues a JWT.
const express = require('express')
const cors = require('cors')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { verifyMessage } = require('ethers')

const PORT = 4001
// Random secret per run: restarting the server invalidates all issued tokens
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex')

const app = express()
app.use(cors())
app.use(express.json())

// address -> one-time nonce waiting to be signed
const nonces = new Map()

const loginMessage = (address, nonce) =>
    `Sign in to Hospital EHR\nAddress: ${address}\nNonce: ${nonce}`

app.get('/nonce', (req, res) => {
    const address = String(req.query.address || '').toLowerCase()
    if (!/^0x[0-9a-f]{40}$/.test(address)) {
        return res.status(400).json({ error: 'Invalid address' })
    }
    const nonce = crypto.randomBytes(16).toString('hex')
    nonces.set(address, nonce)
    res.json({ message: loginMessage(address, nonce) })
})

app.post('/verify', (req, res) => {
    const address = String(req.body.address || '').toLowerCase()
    const nonce = nonces.get(address)
    if (!nonce) {
        return res.status(400).json({ error: 'Request a nonce first' })
    }
    // Each nonce can be used once, so an old signature cannot be replayed
    nonces.delete(address)

    let signer
    try {
        signer = verifyMessage(loginMessage(address, nonce), req.body.signature).toLowerCase()
    } catch (e) {
        return res.status(401).json({ error: 'Invalid signature' })
    }
    if (signer !== address) {
        return res.status(401).json({ error: 'Signature does not match address' })
    }

    const token = jwt.sign({ address }, JWT_SECRET, { expiresIn: '1h' })
    res.json({ token })
})

app.listen(PORT, () => console.log(`Auth server running on http://localhost:${PORT}`))
