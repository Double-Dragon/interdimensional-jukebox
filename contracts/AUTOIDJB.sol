// Jukebox.sol

contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;
  uint numQueued;
  
  event playNext(string title, string author, string id);
  event playlistInfo(uint currentIndex, uint currentLength);

  struct song {
    string title;
    string author;
    string id;
    uint videoLength; // in milliseconds
  }
    
  // adding songs should increase cost wrt. to videoLength;
  modifier notFullPlaylist {
    if (playlist.length - currentSongIndex >= numQueued)
        throw;
    _
  }
  
  modifier notEmptyPlaylist {
    if (playlist.length - currentSongIndex <= 0)
        throw;
    _
  }

  function AUTOIDJB() {
    currentSongIndex = 0;
    lastSongChange = now;
    numQueued = 5;
  }

  function addSong (string title, string author, string id, uint videoLength) notFullPlaylist {
    cleanPlaylist();
    playlist.push(song(title, author, id, videoLength));
  }

  function getNextSongs() returns (string nextSong, string nextNextSong) {
    cleanPlaylist();
    if ((playlist.length - currentSongIndex) >= 1) {
        nextSong = playlist[currentSongIndex].id;
    } else {
        nextSong = "no more songs!";
    }
    if ((playlist.length - currentSongIndex) >= 2) {
        nextNextSong = playlist[currentSongIndex + 1].id;
    } else {
        nextNextSong = 'no more songs!';   
    }
  }

  function getQueuedSongs() notEmptyPlaylist returns (uint sIndex, uint eIndex) {
    return (currentSongIndex, playlist.length);
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
