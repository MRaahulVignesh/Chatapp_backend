const express = require("express");
const PubSub = require("./pubsub");

const DEFAULT_PORT = 3000;

const app = express();

var pubsub;

app.use(express.json());

app.get("/receive/:channel", (req, res) => {
  try {
    res.json({ code: 0, message: pubsub.lastMessage });
  } catch {
    res.json({ code: 1, message: "error transmitting message" });
    console.log("error");
  }
});

app.get("/subscribe/:channel", (req, res) => {
  const channel = req.params.channel;
  try {
    pubsub = new PubSub(channel);
    pubsub.subscribeToChannel(channel);
    res.json({ code: 0, message: "Subscribed Successfully" });
  } catch (error) {
    res.json({ code: 1, message: error.toString() });
    console.log(error);
  }
});

app.post("/send/", (req, res) => {
  const senderId = req.body.senderId;
  const message = req.body.message;
  const channel = req.body.channel;

  try {
    pubsub.sendMessage(senderId, message, channel);
    res.json({ code: 0, message: "message transmitted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ code: 1, message: error.toString() });
  }
});

let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`listening at localhost:${PORT}`);
});
