// deploy contract
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('build'));

app.listen(3000)
console.log('listening on port 3000');
