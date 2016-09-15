web3 = new Web3(new Web3.providers.HttpProvider("https://morden.infura.io/CspWpgT4vuC2gVNShfNQ:443"));

// juxebox contract address goes here
var jukebox = AUTOIDJB.at("0x3bcc8a1a34c4da9308d98afb76b8fafde2d39066");

var playlist = [];

window.onload = function() {
  var addedSongs = jukebox.AddSong({}, {from: "latest"});
  addedSongs.watch(function(err, result) {
    console.log('Heard an event!');
    console.log(result);
    // if (result.args.id === "empty") {
    //   return;
    // }
    // var newPlaylist = playlist.slice(0);
    // newPlaylist.push(result.args.id);
    // playlist = newPlaylist;
  });

  var nextSongs = jukebox.NextSongs({}, {from: "pending"});
  nextSongs.watch(function(err, result) {
    console.log('Next Songs coming up!');
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
