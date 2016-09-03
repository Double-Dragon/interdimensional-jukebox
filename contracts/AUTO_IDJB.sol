// Jukebox.sol

contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;
  uint numQueued;
  
  event playNext(string title, string author, string url);
  event playlistInfo(uint currentIndex, uint currentLength);

  struct song {
    string title;
    string author;
    string url;
    uint videoLength; // in milliseconds
  }
    
  // adding songs should increase cost wrt. to videoLength;
  modifier playlistNotFull {
    if (playlist.length - currentSongIndex >= numQueued)
        throw;
    _
  }

  function IDJB() {
    currentSongIndex = 0;
    lastSongChange = now;
    numQueued = 5;
  }

  function addSong (string title, string author, string url, uint videoLength) playlistNotFull {
    cleanPlaylist();

    playlist.push(song(title, author, url, videoLength));
  }

  function getNextSongs() returns (string nextSong, string nextNextSong) {
    cleanPlaylist();
    if ((playlist.length - currentSongIndex) >= 1) {
        nextSong = playlist[currentSongIndex].url;
    } else {
        nextSong = "no more songs!";
    }
    if ((playlist.length - currentSongIndex) >= 2) {
        nextNextSong = playlist[currentSongIndex + 1].url;
    } else {
        nextNextSong = 'no more songs!';   
    }
    // playNext(playlist[currentSongIndex].title, playlist[currentSongIndex].author, playlist[currentSongIndex].url);
  }

  function cleanPlaylist() {
    uint currentTime = now;
    for (uint i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (playlist[i].videoLength + lastSongChange < currentTime) {
        lastSongChange += playlist[i].videoLength;
        currentSongIndex += 1;
      } else {
        break;
      }
    }
    playlistInfo(currentSongIndex, playlist.length);
  }
}
