# Ethereum Name Service (ENS) Explorer

This application visualizes recent [ENS](https://ens.domains/) transactions with a focus on `BidRevealed` event logs.

## Installation

```shell
$ git clone https://github.com/amitdeshmukh/ens-explorer.git
```

```shell
$ npm install
```

## Usage
Currently, the script will print `BidRevealed` logs to the console. The script is meant to be used within a Vue.js model that provides a user interface via a web browser.

```shell
$ node ens.js

{ block: 7265566,
  event: 'BidRevealed',
  hash:
   '0x0bf990925a0913d8c6cdc18203452adffb4c057d6d9234c58257a594a59045f3',
  owner: '0xbd4ac2646ad731d6b4fdb1b21d6a0a7f2865fa0c',
  value: '0.01',
  status: '2' }
{ block: 7265640,
  event: 'BidRevealed',
  hash:
   '0x0fc9dcac51406ae684d51ed6e90c41b948186a02425bb4776ec0d620bd35a7b6',
  owner: '0xbd4ac2646ad731d6b4fdb1b21d6a0a7f2865fa0c',
  value: '0.01',
  status: '2' }
{ block: 7265890,
  event: 'BidRevealed',
  hash:
   '0xa3df9474acbd8d75a236b870dd3d2d7a1689c1816527fcd11db312e968ebc9de',
  owner: '0x7ac34681f6aaeb691e150c43ee494177c0e2c183',
  value: '0.01',
  status: '2' }
  ...
  ...
  ...
```

