// Jukebox.sol

contract IDJB {

  song[] public playlist;
  uint public currentSongIndex;

  event SongAdd(string title, string author, string url);
  event playNext(string title, string author, string url);

  function IDJB() {
    currentSongIndex = 0;
  }

  struct song {
    string title;
    string author;
    string url;
    uint dateAdded;
    address adder; 
  }

  function addSong(string title, string author, string url) {
      playlist.push(song(title, author, url, now, msg.sender));
      SongAdd(title, author, url);
  }

  // index and list is exposed. 
  function getNextSong() constant returns (string title, string author, string url) {
    title = playlist[currentSongIndex].title;
    author = playlist[currentSongIndex].author;
    url = playlist[currentSongIndex].url;
  }

  function playNextSong() {
    lastSongChange = now;
    currentSongIndex += 1;
    playNext(playlist[currentSongIndex].title, playlist[currentSongIndex].author, playlist[currentSongIndex].url);
  }
} 

// Jukebox.sol

contract IDJB {

	song[] public playlist;
    uint public currentSongIndex;
    uint lastSongChange;
    
    event playNext(string title, string author, string url);
// 	event playNext(song nextSong);

	struct song{
		string title;
		string author;
		string url;
		uint dateAdded;
		address adder; 
	}

	function IDJB(){
		currentSongIndex = 0;
	}

	function addSong(string name, string author, string url){
        playlist.push(song(name, author, url, now, msg.sender));
	}

	function removeSong(){

	}

	function playNextSong(){
        lastSongChange = now;
        currentSongIndex += 1;
        playNext(playlist[currentSongIndex].title, playlist[currentSongIndex].author, playlist[currentSongIndex].url);
	}
} 