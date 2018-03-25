const express = require("express");
const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const uuid = require("uuid");
const getRandomColor = require("randomcolor");

const PORT = 3001;

const server = express()
  .use(express.static("public"))
  .listen(PORT, "0.0.0.0", "localhost", () =>
    console.log(`Listening on ${PORT}`)
  );

const wss = new SocketServer({ server });
wss.broadcast = message => {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
};
const clients = [];
const users = [];
const getUser = id => {
  return users.find(user => user.ws_id === id);
};
const removeUser = id => {
  let index;
  users.find((user, i) => {
    index = i;
    return user.ws_id === id;
  });
  users.splice(index, 1);
};

wss.on("connection", ws => {
  console.log("Client connected");
  ws.id = uuid();
  const user = {
    ws_id: ws.id,
    name: "Anonymous",
    color: getRandomColor({ luminosity: "dark" })
  };

  clients.push(ws);
  users.push(user);

  ws.on("message", message_string => {
    const message = JSON.parse(message_string);

    console.log(users);

    message.id = uuid();
    switch (message.type) {
      case "postMessage":
        message.type = "incomingMessage";
        message.username_color = getUser(ws.id).color;
        break;
      case "postNotification":
        message.type = "incomingNotification";
        switch (message.action) {
          case "changeUsername":
            const words = message.content.split(" ");
            const user = getUser(ws.id);
            user.name = words[words.length - 1];
            message.action = null;
            break;
          case "updateCount":
            message.args = [clients.length];
            break;
        }
        break;
    }
    wss.broadcast(message);
  });

  ws.on("close", () => {
    let index;
    clients.find((array_ws, i) => {
      index = i;
      return array_ws.id === ws.id;
    });
    clients.splice(index, 1);

    const message = {
      type: "incomingNotification",
      content: `${getUser(ws.id).name} left the chatroom`,
      action: "updateCount",
      args: [clients.length]
    };
    removeUser(ws.id);
    wss.broadcast(message);

    console.log("Client disconnected");
  });
});
