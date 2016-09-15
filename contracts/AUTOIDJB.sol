contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;
  uint qLimit;
  uint videoLength;

  event AddSong(string title, string id);
  event NextSongs(
    string id1, string id2, string id3,
    string id4, string id5, string id6);
  event playlistInfo(uint currentIndex, uint currentLength);

  struct song {
    string title;
    string id;
    // uint timestamp;
    // uintu length;
  }

  // adding songs should increase cost wrt. to videoLength;
  modifier notFullPlaylist {
    if (playlist.length - currentSongIndex >= qLimit)
        throw;
    _
  }

  modifier notEmptyPlaylist {
    if (playlist.length - currentSongIndex <= 0)
        throw;
    _
  }
  
  modifier cleanPlaylist() {
    uint currentTime = now;
    for (uint i = currentSongIndex; currentSongIndex < playlist.length; i++) {
      if (videoLength + lastSongChange < currentTime) {
        lastSongChange += videoLength;
        currentSongIndex += 1;
      } else {
        break;
      }
    }
    _
    // playlistInfo(currentSongIndex, playlist.length);
  }

  function AUTOIDJB() {
    currentSongIndex = 0;
    lastSongChange = now;
    qLimit = 1000;
    videoLength = 20;
  }

  function addSong (string title, string id) cleanPlaylist notFullPlaylist {
    playlist.push(song(title, id));
    AddSong(title, id);
  }

  function getNextSongs() cleanPlaylist {
      string memory id1;
      string memory id2;
      string memory id3;
      string memory id4;
      string memory id5;
      string memory id6;
    if ((playlist.length - currentSongIndex) >= 1) {
      id1 = playlist[currentSongIndex].id;
    }
    if ((playlist.length - currentSongIndex) >= 2) {
      id2 = playlist[currentSongIndex + 1].id;
    }
    if ((playlist.length - currentSongIndex) >= 3) {
      id3 = playlist[currentSongIndex + 2].id;
    }
    if ((playlist.length - currentSongIndex) >= 4) {
      id4 = playlist[currentSongIndex + 3].id;
    }
    if ((playlist.length - currentSongIndex) >= 5) {
      id5 = playlist[currentSongIndex + 4].id;
    }
    if ((playlist.length - currentSongIndex) >= 6) {
      id6 = playlist[currentSongIndex + 5].id;
    }
    NextSongs(
      id1, id2, id3,
      id4, id5, id6);
  }

  function getQueuedPlaylistLength() cleanPlaylist notEmptyPlaylist returns (uint sIndex, uint eIndex) {
    return (currentSongIndex, playlist.length);
  }
}

