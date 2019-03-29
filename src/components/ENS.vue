<template>
  <div id="ens">
    <nav class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <h2>{{ ensSummary.msg }}</h2>
      </div>
    </nav>
    <!-- ENS Contract Event Summary -->
    <div class="container mt-5">
      <div class="row text-uppercase text-center mb-5" v-if="ensSummary.loaded">
        <div class="col-12 col-sm" v-for="(events, type) in ensSummary.eventSummary" :key="type">
          <p class="lead mb-0">{{ type }}</p>
          <h1 class="display-5">{{ events }}</h1>
        </div>
      </div>
      <!-- Placeholder -->
      <div class="row text-uppercase text-center mb-5" v-else>
        <div class="col-12 col-sm">
          <p class="lead mb-0"> Loading Data from ENS Contract ... </p>
        </div>
      </div>

      <!-- Top LabelHashes by Bid Value -->
      <div v-if="ensSummary.loaded">
      <div class="card-deck">
        <div class="card bg-light mb-3" style="max-width: 100rem;">
          <h3 class="card-header">Top 5 NameHashes by Bid Value</h3>
          <div v-for="hash in Object.keys(nameHashes).sort((x,y) => {return nameHashes[x]-nameHashes[y]}).reverse().slice(0,5)" :key="hash" class="card-body">
            <dd>{{ hash }}</dd>
            <dt>Bids {{ bidsByNameHash[hash] }} <dt>
            <dt>ETH {{ nameHashes[hash] }} </dt>
          </div>
        </div>
        <!-- Top Bidders -->
        <div div class="card bg-light mb-3" style="max-width: 100rem;">
          <h3 class="card-header">Top 5 Bidder Accounts</h3>
          <div v-for="owner in Object.keys(bidders).sort((x,y) => {return bidders[x]-bidders[y]}).reverse().slice(0,5)" :key="owner" class="card-body">
            <dd>{{ owner }}</dd>
            <dt>ETH {{ bidders[owner] }} </dt>
          </div>
        </div>
      </div>
      </div>

      <!-- "BidRevealed" Event details -->
      <h3 v-if="ensSummary.loaded">"BidRevealed" Events</h3>
      <div v-for="(bid, index) in ensBids.bids" :key="index" class="card mb-3">
        <div class="card-body">
          <h4 class="card-title">ETH {{ bid.value }}</h4>
          <h6 class="card-subtitle mb-2 text-muted">Bidder: {{ bid.owner }}</h6>
          <dl class="row">
            <dt class="col-sm-3">NameHash</dt>
            <dd class="col-sm-9">{{ bid.hash }}</dd>
            <dt class="col-sm-3">Block number</dt>
            <dd class="col-sm-9">{{ bid.block }}</dd>
          </dl>
        </div>
      </div>
    </div>

    <div class="bg-light text-center py-5 mt-5">
      <div class="container">
        <p>
          <strong>ENS Explorer</strong> by <a href="https://github.com/amitdeshmukh">Amit Deshmukh</a>.
        </p>
      </div>
    </div>
  </div>
</template>

<script>

/* eslint-disable */
import Vue from 'vue'
import Web3 from 'web3'
import abiDecoder from 'abi-decoder'
import ensContractABI from '../assets/ensContractABI'

// Bootstrap Web3
const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://mainnet.infura.io/ws/v3/311d6f6491fa42c6b984cecadd45db6c'))
abiDecoder.addABI(ensContractABI);
const ensContractAddress = '0x6090A6e47849629b7245Dfa1Ca21D94cd15878Ef'
const ensContract = new web3.eth.Contract(ensContractABI, ensContractAddress)

export default {
  name: 'ens-explorer',
  components: {

  },

  data () {
    return {
      ensSummary: {
        msg: 'ENS Explorer',
        eventSummary: {},
        loaded: false
      },
      ensBids: {
        bids: [],
      },
      nameHashes: {},
      bidders: {},
      bidsByNameHash: {},
    }
  },

  created () {
    this.getEnsEvents()
  },

  methods: {
    // Function - obtain current block
    async currentBlock() {
      var currentBlock = await web3.eth.getBlockNumber()
      return currentBlock
    },

    // Function - retrieve ENS events
    getEnsEvents () {
      // get currentBlock
      this.currentBlock().then((b) => {
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
          this.ensSummary.loaded = true

          // parse events
          if (typeof(event.event) === 'string') {
            this.ensSummary.eventSummary[event.event]  = (parseInt(this.ensSummary.eventSummary[event.event]) || 0) + 1
            var txHash = event.transactionHash
            var eventBlockNumber = event.blockNumber

            // decode 'BidRevealed' event logs
            try {
              await web3.eth.getTransactionReceipt(txHash, (e, receipt) => {
                var decodedLogs = abiDecoder.decodeLogs(receipt.logs)
                decodedLogs.forEach(async (l) => {
                  if (l && l.name == 'BidRevealed') {
                    var eventName = l.name
                    var o = {}
                    var hash
                    o['block'] = eventBlockNumber
                    o['event'] = eventName
                    o['txhash'] = txHash

                    // Add to ensBids.bids
                    l.events.forEach((e) => {
                      var k = e.name
                      hash  = (k === 'hash') ? hash : undefined
                      var v = (k === 'deposit' || k === 'value') ? web3.utils.fromWei((e.value).toString(), 'ether') : (e.value).toString()
                      o[k] = v
                    })
                    this.ensBids.bids.push(o)

                    // Add to nameHashes
                    this.nameHashes[o.hash] = this.nameHashes[o.hash] ? this.nameHashes[o.hash] + parseFloat(o.value) : parseFloat(o.value)

                    //Add to bidders
                    this.bidders[o.owner] = this.bidders[o.owner] ? this.bidders[o.owner] + parseFloat(o.value) : parseFloat(o.value)

                    // Bids per hash
                    this.bidsByNameHash[o.hash] = this.bidsByNameHash[o.hash] ? this.bidsByNameHash[o.hash] + 1 : 1
                  }
                })
              })
            } catch (err) {
                console.log('An error occured:', err)
            }
          }
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#ens {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 60px;
}
h1, h2 {
  /* font-weight: normal; */
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: block;
  margin: 0 10px;
}
a {
  color: #007bff;
}
</style>
