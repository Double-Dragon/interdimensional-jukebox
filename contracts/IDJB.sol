// Jukebox.sol

contract IDJB {

  address MasterController;
  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;

  event playNext(string title, string author, string url);

  modifier onlyMasterController {
    if (MasterController != msg.sender)
        throw;
    _
  }

  function IDJB() {
    currentSongIndex = 0;
    MasterController = msg.sender;
  }

  struct song {
    string title;
    string author;
    string url;
    uint videoLength; // in milliseconds
    uint dateAdded;
    address adder; 
  }

  function addSong(string title, string author, string url, uint vLength) {
    playlist.push(song(title, author, url, vLength, now, msg.sender));

  function cleanPlaylist() {
    var currentTime = now;
    for (var i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (playlist[i].videoLength + lastSongChange < currentTime) {
        currentSongIndex += 1;
      }
    }
  }

// we don't need this function because the contract already exposes the list and the currentSongIndex
  // function getNextSong() constant returns (string title, string author, string url) {
  //   title = playlist[currentSongIndex].title;
  //   author = playlist[currentSongIndex].author;
  //   url = playlist[currentSongIndex].url;
  // }

  function playNextSong() onlyMasterController {
    lastSongChange = now;
    currentSongIndex += 1;
    playNext(playlist[currentSongIndex].title, playlist[currentSongIndex].author, playlist[currentSongIndex].url);
  }
} 
