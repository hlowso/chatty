const express = require("express");
const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const uuid = require("uuid");

// Set the port to 3001
const PORT = 3001;

// Create a new express server
const server = express()
  // Make the express server serve static assets (html, javascript, css) from the /public folder
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

// Create the WebSockets server
const wss = new SocketServer({ server });
wss.broadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
const clients = [];
const users = {};

// Set up a callback that will run when a client connects to the server
// When a client connects they are assigned a socket, represented by
// the ws parameter in the callback.
wss.on("connection", ws => {
  console.log("Client connected");
  ws.id = uuid();
  clients.push(ws);
  users[ws.id] = "Anonymous";

  ws.on("message", message_string => {
    const message = JSON.parse(message_string);

    message.id = uuid();
    switch (message.type) {
      case "postMessage":
        message.type = "incomingMessage";
        break;
      case "postNotification":
        message.type = "incomingNotification";
        switch (message.action) {
          case "changeUsername":
            const words = message.content.split(" ");
            users[ws.id] = words[words.length - 1];
            message.action = null;
            break;
          case "updateCount":
            message.args = [clients.length];
            break;
          // case "decrement":
          //   message.action = "updateCount";
          //   message.args = [clients.length - 1];
          //   break;
        }
        break;
    }
    wss.broadcast(message);
  });

  // Set up a callback for when a client closes the socket. This usually means they closed their browser.
  ws.on("close", () => {
    let index;
    clients.find((array_ws, i) => {
      index = i;
      return array_ws.id === ws.id;
    });
    clients.splice(index, 1);

    const message = {
      type: "incomingNotification",
      content: `${users[ws.id]} left the chatroom`,
      action: "updateCount",
      args: [clients.length]
    };

    wss.broadcast(message);
    delete users[ws.id];

    console.log("Client disconnected");
  });
});
