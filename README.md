# Ethereum Name Service (ENS) Explorer

This application visualizes recent [ENS](https://ens.domains/) transactions with a focus on `BidRevealed` event logs.

## Installation

```bash
# clone this repo
$ git clone https://github.com/amitdeshmukh/ens-explorer.git

# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm run dev

# build for production with minification
$ npm run build

# run all tests
$ npm test
```

## Usage

Browse to [http://localhost:8080](http://localhost:8080)

Currently, the app will display a summary of ENS contract events, and some basic metrics related to `BidRevealed` events:
- Top 5 NameHashes by bid value
- Top 5 bidding accounts

Individual `BidRevealed` events are also displayed.

## Todo

1. Write Unit Tests
2. Implement config file
3. Implement additional metrics

