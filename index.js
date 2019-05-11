const fs = require("fs");
const https = require("https");

const privateKey = fs.readFileSync("sslcert/key.pem", "utf8");
const certificate = fs.readFileSync("sslcert/cert.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };
const express = require("express");
const app = express();

const httpsServer = https.createServer(credentials, app);
httpsServer.listen(8443, () => console.log("Server listening on port 8443..."));

const WebSocketServer = require("ws").Server;
const wss = new WebSocketServer({
  server: httpsServer,
  path: "/ws"
});

wss.on("connection", ws => {
  ws.on("message", msg => {
    console.log(`received: ${msg}`);
  });

  setInterval(() => {
    ws.send("something");
  }, 3000);
});

// https://github.com/websockets/ws/blob/master/doc/ws.md
// http://www.chovy.com/web-development/self-signed-certs-with-secure-websockets-in-node-js/
// https://www.websocket.org/echo.html

// In browser:
// https://0.0.0.0:8443/
// var ws = new WebSocket('wss://0.0.0.0:8443/ws');
// ws.send('foo');
// ws.onmessage = function(msg) { console.log(msg) }
// ws.close();
