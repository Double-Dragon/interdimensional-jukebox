// Jukebox.sol

contract IDJB {
	string[] urllist;
	song[] playlist;

	event playNext(string songName, string author, string url);

	struct song{
		string title;
		string author;
		string url;
		uint dateAdded;
		address adder; 
	}

	function IDJB(){

	}

	function addSong(){

	}

	function removeSong(){

	}

	function playNextSong(){

	}


} 