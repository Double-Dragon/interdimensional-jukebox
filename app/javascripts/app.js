// app.js submits actions and listens to events on ethereum
// consider moving off of truffle.
var accounts;
var account;
var balance;

// add morden as test provider to listen in on events.
// web3 = new Web3(new Web3.providers.HttpProvider("https://morden.infura.io/CspWpgT4vuC2gVNShfNQ:443"));
// console.log(web3.eth.blockNumber);

var jukebox = AUTOIDJB.at("0x3bcc8a1a34c4da9308d98afb76b8fafde2d39066"); // contract address goes here
// var jukebox = AUTOIDJB.deployed();

function addSong() {
  var url = document.getElementById("url").value;
  var title = document.getElementById("title").value;
  jukebox.addSong(title, url, {from: account}).then(function(msg) {
    console.log("Success! Transaction ID:", msg);
  })
  .catch(function(e) {
    console.log("Failure! Encountered Error:");
    console.log(e);
  });
}

function getNextSongs() {
  jukebox.getNextSongs({from: account}).then(function(msg) {
    console.log("Success! Transaction ID:", msg);
  })
  .catch(function(e) {
    console.log("Failure! Encountered Error:");
    console.log(e);
  })
}

var playlist = [];

window.onload = function() {
  web3.eth.getAccounts(function(err, accs) {
    if (err != null) {
      console.log(err);
      alert("There was an error fetching your accounts.");
      return;
    }

    if (accs.length == 0) {
      alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
      return;
    }

    accounts = accs;
    account = accounts[0];
  });

  var addedSongs = jukebox.AddSong({}, {from: "pending"});
  addedSongs.watch(function(err, result) {
    console.log('Heard an event!');
    console.log(result);
    if (result.args.id === "empty") {
      return;
    }
    var newPlaylist = playlist.slice(0);
    newPlaylist.push(result.args.id);
    playlist = newPlaylist;
  });

  var nextSongs = jukebox.NextSongs({}, {from: "pending"});
  nextSongs.watch(function(err, result) {
    console.log('Next Songs coming up!');
    console.log(result);
    var newPlaylist = playlist.slice(0);
    for (var each in result.args) {
      if (playlist.indexOf(result.args[each]) === -1) {
        playlist.push(result.args[each]);
      }
    }
    playlist = newPlaylist;
  });
}
