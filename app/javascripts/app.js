var accounts;
var account;
var balance;

var jukebox = AUTOIDJB.deployed();

function addSong() {
  var url = document.getElementById("url").value;
  var author = document.getElementById("author").value;
  var title = document.getElementById("title").value;
  jukebox.addSong(title, author, url, {from: account}).then(function(msg) {
    console.log("Transaction ID:", msg);
  })
  .catch(function(e) {
    console.log('Encountered Error:');
    console.log(e);
  });
}

var playlist = [];
jukebox.playNext({from: "latest"}).watch(function(err, result) {
  console.log(result);
  var newPlaylist = [];
  for (var i = 0; i < result.length; i++) {
    newPlaylist.push[result[i]];
    playlist = newPlaylist;
  }
});

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
