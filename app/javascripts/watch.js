web3 = new Web3(new Web3.providers.HttpProvider("https://morden.infura.io/CspWpgT4vuC2gVNShfNQ:443"));

// juxebox contract address goes here
var jukebox = AUTOIDJB.at("0x6b02b2424d67d9e9533ba87ab73bb12b32f55834");

var playlist = [];

window.onload = function() {
  var addedSongs = jukebox.AddSong({}, {from: "latest"});
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
}
