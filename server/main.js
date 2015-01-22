const fs = require('fs');
const http = require('http');
const nconf = require('nconf');
const express = require('express');
const relativePath = require('./relative-path');

nconf.argv().env('_').file({
  file: relativePath('../config/config.json')
}).defaults({
  'admins': []
});

let app = express();
app.use(express.static(relativePath('../static')));

let appTemplate = fs.readFileSync(relativePath('../static/template.html'),
                                  'utf8');

app.get('*', function(req, res, next) {
  res.send(appTemplate);
});

let server = http.createServer(app);
server.listen(nconf.get('http:port'));

console.log('Started server on ' + nconf.get('http:port') + '...');
