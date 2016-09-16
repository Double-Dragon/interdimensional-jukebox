# Interdimensional Jukebox
Interdimensional Jukebox (IDJB) is an ethereum smart contract + mini client that lets you listen to a universal jukebox that lives on the ethereum blockchain. 

Anyone can submit Youtube songs or videos to the Jukebox (for the cost of gas) and anyone can listen in on the Jukebox for free! 

## Getting started
#### Watch Client
To listen to IDJB, simply open `build/watch.html` directory. If the contract has been republished to a new address, you'll have to update the contract address near the bottom of `build/watch.js`. The snippet to edit should look like this: 

```
// juxebox contract address goes here
var jukebox = AUTOIDJB.at("0x86378e41ebe6be06ef83c6629723b533e2dd4a33");
```

#### Full Client
To publish to IDJB, you'll first have to sync up to the ethereum testnet morden. Once synced, make sure to:

 - secure some ethereum to fund transactions `miner.start()` with geth
 - allow rpc connection to your ethereum client `--rpc` flag with geth
 - allow cors requests to your client `--rpccorsdomain="*"`
 - unlock your local ethereum wallet with `personal.unlock(<your account>)`

As with the watch client, if the contract has been published to a new address, you'll have to update the client, this time inside `build/app.js`. Once you've done this, simply open up `build/index.html` and you can begin submitting videos to IDJB!. The contract currently accepts a title name and youtubeID, the characters at the end of all Youtube videos -- https://www.youtube.com/watch?v= **ZZ5LpwO-An4**
