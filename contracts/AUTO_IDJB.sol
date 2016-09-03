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

  function addSong(string title, string author, string url) {
    playlist.push(song(title, author, url, now, msg.sender));
  }

  function cleanPlaylist() {
    var currentTime = now;
    for (var i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (playlist[i].videoLength + lastSongChange < currentTime) {
        currentSongIndex += 1;
      }
    }
  }

  function playNextSong() onlyMasterController {
    lastSongChange = now;
    currentSongIndex += 1;
    playNext(playlist[currentSongIndex].title, playlist[currentSongIndex].author, playlist[currentSongIndex].url);
  }
} 