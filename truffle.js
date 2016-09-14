module.exports = {
  build: {
    "index.html": "index.html",
    "watch.html": "watch.html",
    "submit.html": "submit.html",
    "app.js": [
      "javascripts/app.js",
      "javascripts/videoPlayer.js"
    ],
    "watch.js": [
      "javascripts/watch.js",
      "javascripts/videoPlayer.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ]
  },
  rpc: {
    host: "localhost",
    port: 8545
  }
};
