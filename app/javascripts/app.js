// app.js submits actions and listens to events on ethereum
// consider moving off of truffle.
var accounts;
var account;
var balance;

// add morden as test provider to listen in on events.
// web3 = new Web3(new Web3.providers.HttpProvider("https://morden.infura.io/CspWpgT4vuC2gVNShfNQ:443"));
// console.log(web3.eth.blockNumber);

var jukebox = AUTOIDJB.at("0x000901e9df262972237048f1d7837c52c4b57e6c"); // contract address goes here
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

  var addedSongs = jukebox.AddSong({}, {from: "latest"});
  addedSongs.watch(function(err, result) {
    console.log('Heard event: AddSong!');
    console.log(result);
    // var newPlaylist = playlist.slice(0);
    // newPlaylist.push(result.args.id);
    // playlist = newPlaylist;
  });

  var nextSongs = jukebox.NextSongs({}, {from: "latest"});
  nextSongs.watch(function(err, result) {
    console.log('Heard Event: NextSongs!');
    console.log(result);
    var newPlaylist = playlist.slice(0);
    for (var each in result.args) {
      if (newPlaylist.indexOf(result.args[each]) === -1) {
        newPlaylist.push(result.args[each]);
      }
    }
    playlist = newPlaylist;
  });
  var playlistLength = jukebox.PlaylistInfo({}, {from: "latest"});
  playlistLength.watch(function(err, result) {
    console.log('Heard Event: PlaylistInfo');
    console.log(result);
  });
}
