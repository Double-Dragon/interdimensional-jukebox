contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;
  uint qLimit;
  uint videoLength;

  event SongAdded(string title, string author, string id);
  event playlistInfo(uint currentIndex, uint currentLength);

  struct song {
    string title;
    string author;
    string id;
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
    playlistInfo(currentSongIndex, playlist.length);
  }

  function AUTOIDJB() {
    currentSongIndex = 0;
    lastSongChange = now;
    qLimit = 10;
    videoLength = 10; // time of each video in seconds can be param of AUTOIDJB
  }

  // Everytime a song is added, an AddSong event emitted.
  function addSong (string title, string author, string id) cleanPlaylist notFullPlaylist {
    playlist.push(song(title, author, id));
    AddSong(title, author, id);
  }

  //TODO: add author and title to each field
  //Could emit an event instead of returning
  function getNextSongs() returns (string nextSong, string nextNextSong) {
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

  function getQueuedPlaylistLength() cleanPlaylist notEmptyPlaylist returns (uint sIndex, uint eIndex) {
    return (currentSongIndex, playlist.length);
  }

}
