var accounts;
var account;
var balance;

function addSong() {
  var jukebox = IDJB.deployed();

  var url = document.getElementById("url").value;
  var author = document.getElementById("author").value;
  var title = document.getElementById("title").value;
  jukebox.addSong(title, author, url, {from: account}).then(function(msg) {
    console.log(msg);
  })
  .catch(function(e) {
    console.log('Encountered Error:');
    console.log(e);
  });
}

function getNextSong() {
  var jukebox = IDJB.deployed();
  jukebox.getNextSong.call({from: account}).then(function(msg) {
    console.log('Getting Playlist:');
    console.log(msg);
  })
}

function readStruct() {
  var jukebox = IDJB.deployed();
  jukebox.currentSongIndex.call({from: account}).then(function(msg) {
    console.log('Reading Struct:');
    console.log(msg);
  })
}

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
}
