const http = require('http');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
let cache = {};

function send404(response) {
  response.writeHead(404, { 'content-Type': 'text/plain' });
  response.write('Error 404: resource not found');
  response.end();
}

function sendFile(response, filePath, fileContents) {
  response.writeHead(
    200,
    { 'content-Type': mime.lookup(path.basename(filePath)) }
  );
  response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
  if (cache[absPath]) {
    sendFile(response, absPath, cache[absPath]);
  } else {
    fs.exists(absPath, function (exists) {
      if (exists) {
        fs.readFile (absPath, function (err, data) {
          if (err) {
            send404(response);
          } else {
            cache[absPath] = data;
            sendFile(response, absPath, data);
          }
        });
      } else {
        send404(response);
      }
    });
  }
}

let server = http.createServer(function (request, response) {
  let filePath = false;

  if (request.url == '/') {
    filePath = 'public/index.html';
  } else {
    filePath = 'public' + request.url;
  }

  let absPath = './' + filePath;
  serveStatic(response, cache, absPath);
});

server.listen(3000, function(){
  console.log('Server listening on port 3000.');
  console.log('To view to app visit http://127.0.0.1:3000/');
  console.log('Happy Hacking !!');
});

// Loads functionality from a custom Node Module that
// supplies logic to handle Socket IO-based server-side
// // Starts the Socket.IO server functionality, providing it with an
// // already defined HTTP server so it can share the same TCP/IP port.

let chatServer = require('./lib/chat-server');
chatServer.listen(server);
