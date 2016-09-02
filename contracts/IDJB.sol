// Jukebox.sol

contract IDJB {

	song[] public playlist;
    uint currentSongIndex;
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
        
	}


} 