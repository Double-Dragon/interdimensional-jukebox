web3 = new Web3(new Web3.providers.HttpProvider("https://morden.infura.io/CspWpgT4vuC2gVNShfNQ:443"));

// juxebox contract address goes here
var jukebox = AUTOIDJB.at("0x86378e41ebe6be06ef83c6629723b533e2dd4a33");

var playlist = [];

window.onload = function() {
  var addedSongs = jukebox.AddSong({}, {from: "latest"});
  addedSongs.watch(function(err, result) {
    console.log('Heard event: Add Song');
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
    console.log('Heard Event: NextSongs');
    console.log(result);
    // var newPlaylist = playlist.slice(0);
    // for (var each in result.args) {
    //   if (playlist.indexOf(result.args[each]) === -1) {
    //     playlist.push(result.args[each]);
    //   }
    // }
    // playlist = newPlaylist;
  });
}
