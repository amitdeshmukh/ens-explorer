const Web3 = require('web3')
const abiDecoder = require('abi-decoder')
const util = require('util')
const ensContractABI = require('./ensContractABI')
const ensContractAddress = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef'

// setup
abiDecoder.addABI(ensContractABI);
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws'));
let ensContract = new web3.eth.Contract(ensContractABI, ensContractAddress)

const currentBlock = async () => {
  var currentBlock = await web3.eth.getBlockNumber()
  return currentBlock
}

let eventSummary = {}
let BidRevealed = []

// get currentBlock
currentBlock().then((b) => {
  // blockNumber 1 day ago @ approx 5750 blocks per day
  return (b - (5750 * 1)) 
})
.then((s) => {
  // fetch event logs from startBlock
  let startBlock = s

  // Contract Events
  ensContract.events.allEvents({fromBlock: startBlock}, async (err, event) => {
    if (err) {
      console.log('An error occured', err)
      return
    }

    // parse events
    if (typeof(event.event) === 'string') {
      eventSummary[event.event]  = (parseInt(eventSummary[event.event]) || 0) + 1
      var txHash = event.transactionHash
      var eventBlockNumber = event.blockNumber
      try {
        await web3.eth.getTransactionReceipt(txHash, (e, receipt) => {
          var decodedLogs = abiDecoder.decodeLogs(receipt.logs)
          decodedLogs.forEach(l => {
            if (l && l.name == 'BidRevealed') {
              var eventName = l.name
              var o = {}
              var hash
              o['block'] = eventBlockNumber
              o['event'] = eventName
              l.events.forEach((e) => {
                var k = e.name
                hash  = (k === 'hash') ? hash : undefined
                var v = (k === 'deposit' || k === 'value') ? web3.utils.fromWei((e.value).toString(), 'ether') : (e.value).toString()
                o[k] = v
              })
              console.log(o)
              BidRevealed.push(o)
            }
          })
        })
      } catch (err) {
          console.log('An error occured:', err)
      }
    }
  })
})

