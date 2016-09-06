contract AUTOIDJB {

  song[] public playlist;
  uint public currentSongIndex;
  uint public lastSongChange;
  uint qLimit;
  uint videoLength;

  event AddSong(string title, string id);
  event NextSongs(
    string title1, string id1,
    string title2, string id2,
    string title3, string id3);
  event playlistInfo(uint currentIndex, uint currentLength);

  struct song {
    string title;
    string id;
    // uint timestamp;
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
  function addSong (string title, string id) cleanPlaylist notFullPlaylist {
    playlist.push(song(title, id));
    AddSong(title, id);
  }

  //TODO: add author and title to each field
  //Could emit an event instead of returning
  function getNextSongs() cleanPlaylist {
      string memory title1 = "";
      string memory id1 = "empty";
      string memory title2 = "empty";
      string memory id2 = "empty";
      string memory title3 = "empty";
      string memory id3 = "empty";
    if ((playlist.length - currentSongIndex) >= 1) {
      title1 = playlist[currentSongIndex].title;
      id1 = playlist[currentSongIndex].id;
    }
    if ((playlist.length - currentSongIndex) >= 2) {
      title2 = playlist[currentSongIndex + 1].title;
      id2 = playlist[currentSongIndex + 1].id;
    }
    if ((playlist.length - currentSongIndex) >= 3) {
      title3 = playlist[currentSongIndex + 2].title;
      id3 = playlist[currentSongIndex + 2].id;
    }
    NextSongs(
      title1, id1,
      title2, id2,
      title3, id3);
  }

  function getQueuedPlaylistLength() cleanPlaylist notEmptyPlaylist returns (uint sIndex, uint eIndex) {
    return (currentSongIndex, playlist.length);
  }
}
