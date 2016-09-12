module.exports = {
  build: {
    "index.html": "index.html",
    "app.js": [
      "javascripts/app.js",
      "javascripts/videoPlayer.js"
    ],
    "app.css": [
      "stylesheets/app.css"
    ],
    "images/": "images/"
  },
  rpc: {
    host: "https://morden.infura.io/CspWpgT4vuC2gVNShfNQ",
    port: 8545
  }
};
