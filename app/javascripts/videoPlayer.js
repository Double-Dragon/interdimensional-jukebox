var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'YmNlWf3Lvhw',
    events: {
      'onReady': onPlayerReady,
    }
  });
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

function playNextSong() {
  console.log('playNextSong wrapper');
  if (!playlist[0]) {
    setTimeout(() => playNext(defaultSong), 12000);
  } else {
    setTimeout(() => playNext(defaultSong), 5000);
  }
}

function playNext(videoObject) {
  console.log('playNext');
  player.loadVideoById(videoObject);
  playlist.pop();
  playNextSong();
}
