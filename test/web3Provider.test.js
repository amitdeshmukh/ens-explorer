/* eslint-disable no-undef */
const assert = require('assert')
const Web3 = require('web3')
const INFURA_WSS = 'wss://mainnet.infura.io/ws/v3/311d6f6491fa42c6b984cecadd45db6c'
const provider = new Web3.providers.WebsocketProvider(INFURA_WSS)

const web3 = new Web3(provider)

describe('Web3', () => {
  it('WebSocketProvider test', async () => {
    const network = await web3.eth.net.getNetworkType().then(data => { return data })
    assert.equal(network, 'main')
  })
})
