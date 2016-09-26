var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
var playlistUL = document.getElementById('playlist');
var playlistLIs = [];
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '680',
    videoId: 'cr0CcRNOI88',
    events: {
      'onReady': onPlayerReady,
    }
  });
}

(function populatePlaylistView() {
  playlistLIs = playlist.map(id => (`<li>${id}</li>`));
  playlistUL.innerHTML = playlistLIs.join('');
})();

function dequeuePlaylistView() {
  if (playlistLIs.length > 0) {
    playlistLIs.shift();
    playlistUL.innerHTML = playlistLIs.join('');
  }
}

function onPlayerReady(event) {
  event.target.playVideo();
  console.log('Player is Ready');
  setTimeout(playNextSong, 1000);
}

var stop = false;
var defaultSong = {
  'videoId': "oFRl4YmVP4Q",
  'startSeconds': 0,
  'endSeconds': 60,
  'suggestedQuality': 'large'
}

var songTemplate = {
  'startSeconds': 0,
  'endSeconds': 60,
  'suggestedQuality': 'large'
}

function playNextSong() {
  if (playlist[0] === undefined) {
    setTimeout(() => {
      console.log('Playing Default');
      playNext(defaultSong)
    }, 30000);
  } else {
    setTimeout(() => {
      nextVideo = playlist.shift();
      dequeuePlaylistView();
      playNext(Object.assign({}, songTemplate, {videoId: nextVideo}));
    }, 30000);
  }
}

function playNext(videoObject) {
  player.loadVideoById(videoObject);
  playNextSong();
}

function logPlaylist() {
  console.log('Playlist:');
  console.log(playlist);
}
