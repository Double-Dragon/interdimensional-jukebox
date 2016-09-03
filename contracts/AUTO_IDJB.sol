// Jukebox.sol

contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint256 public lastSongChange;
  
  event playNext(string title, string author, string url);
  event CurrentSongIndex(uint currentIndex, uint currentLength);

  function IDJB() {
    currentSongIndex = 0;
    lastSongChange = now;
  }

  struct song {
    string title;
    string author;
    string url;
    uint videoLength; // in milliseconds
  }

  function addSong(string title, string author, string url, uint videoLength) {
    cleanPlaylist();
    if (playlist.length - currentSongIndex >= 5) throw;
    // adding songs should increase cost wrt. to videoLength;
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
    uint256 currentTime = now;
    for (uint i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (playlist[i].videoLength + lastSongChange < currentTime) {
        lastSongChange += playlist[i].videoLength;
        currentSongIndex += 1;
      } else {
        break;
      }
    }
    CurrentSongIndex(currentSongIndex, playlist.length);
  }
}
