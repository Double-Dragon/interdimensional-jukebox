// Jukebox.sol

contract IDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;

  event playNext(string title, string author, string url);

  function IDJB() {
    currentSongIndex = 0;
  }

  struct song {
    string title;
    string author;
    string url;
    uint videoLength; // in milliseconds
    uint dateAdded;
    address adder; 
  }

  function addSong(string title, string author, string url, uint videoLength) {
    if (playlist.length - currentSongIndex <= 5) throw;
    playlist.push(song(title, author, url, videoLength, now, msg.sender));
  }

  function cleanPlaylist() {
    var currentTime = now;
    for (var i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (playlist[i].videoLength + lastSongChange < currentTime) {
        lastSongChange += playlist[i].videoLength;
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