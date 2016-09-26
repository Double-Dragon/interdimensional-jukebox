// deploy contract
var portNumber = process.env.PORT || 3000
var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('build'));

app.listen(portNumber)
console.log('listening on port' + portNumber);
