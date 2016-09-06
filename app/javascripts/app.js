// This file submits actions and listens to events on ethereum
var accounts;
var account;
var balance;

var jukebox = AUTOIDJB.deployed();

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

  // var addedSongs = jukebox.AddSong({}, {from: "latest"});
  // addedSongs.watch(function(err, result) {
  //   console.log('Heard an event!');
  //   console.log(result);
  //   var newPlaylist = playlist.slice(0);
  //   newPlaylist.push(result.args.id);
  //   playlist = newPlaylist;
  // });

  // TODO: remove entries which return string "empty"
  var nextSongs = jukebox.NextSongs({from: "latest"});
  nextSongs.watch(function(err, result) {
    console.log('Next Songs coming up!');
    console.log(result);
    var newPlaylist = playlist.slice(0);
    // TODO: add error handling on bad result
    newPlaylist.push(result.args.id1);
    newPlaylist.push(result.args.id2);
    playlist = newPlaylist;
  })
}
