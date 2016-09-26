// deploy contract
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('build'));

app.listen(80)
console.log('listening on port 80');
