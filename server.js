var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'build')));

// app.get('/', function (req, res) {
//   res.send('hello world!');
// });

app.listen(3000);
console.log('listening on port 3000');

