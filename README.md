## Interdimensional Jukebox
Interdimensional Jukebox (IDJB) is an ethereum smart contract + mini client that lets you listen to a universal jukebox that lives on the ethereum blockchain. 

Anyone can submit Youtube songs or videos to the Jukebox (for the cost of gas) and anyone can listen in on the Jukebox for free! 

## Getting started
##### Watch Client
To listen to IDJB, simply open `build/watch.html` directory. If the contract has been republished to a new address, you'll have to update the contract address near the bottom of `build/watch.js`. The snippet should look like this: 
```
// juxebox contract address goes here
var jukebox = AUTOIDJB.at("0x86378e41ebe6be06ef83c6629723b533e2dd4a33");
```

You can also visit: https://interdimensional-jukebox.herokuapp.com/watch.html

##### Full Client
To publish to IDJB, you'll first have to sync up to the ethereum testnet morden using your favorite ethereum client. Once synced you'll need to: 

(the following flags are for geth)
- enable rpc connections to your ethereum client `--rpc`
- enable cors requests to your ethereum client `--rpccorsdomain="*"`
- enable console commands to your ethereum client `console`
- make sure you're connecting to Morden using `--testnet`

You're geth command will look like this:
```
geth --rpc --rpccorsdomain="*" --testnet console
```

Once inside the synced geth client:
- make sure to secure some ether to fund the gas cost of transactions: `miner.start()`
- And unlock your account before every transaction: `personal.unlock(<your account>)`

As with the watch client, if the contract has been published to a new address, you'll have to update the client, this time inside `build/app.js`. Once you've done this, simply open up `build/index.html` and you can begin submitting videos to IDJB!. The contract currently accepts a title and youtubeID-- the characters at the end of Youtube videos: https://www.youtube.com/watch?v= **ZZ5LpwO-An4**
