const PubNub = require('pubnub');
require('dotenv').config()


const credentials = {
  publishKey: process.env.publishKey.toString(),
  subscribeKey: process.env.subscribeKey.toString(),
  secretKey: process.env.secretKey.toString()
};

class PubSub {
  constructor(channel) {

    this.lastMessage = ""
    
    this.pubnub = new PubNub(credentials);

    this.pubnub.subscribe({ channel: channel});

    this.pubnub.addListener(this.listener());

  }

  sendMessage(senderId, message, channel) {
    const message_block = {
      sender: senderId,
      contents: message
    }
    this.publish({
      channel: channel,
      message: JSON.stringify(message_block)
    });
    
  }

  subscribeToChannel(channel) {
    var channels = [channel]
    this.pubnub.subscribe({
      channels: channels
    });
  }

  listener() {
    return {
      message: messageObject => {
        const { channel, message } = messageObject;
        console.log(`Message received. Channel: ${channel}. Message: ${message}`);
        const parsedMessage = JSON.parse(message);
        this.lastMessage = parsedMessage
      }
    }
  }

  publish({ channel, message }) {
    this.pubnub.publish({ message, channel });
  }

 
}

module.exports = PubSub;