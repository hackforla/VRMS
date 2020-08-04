const express = require("express");
const router = express.Router();
const { App } = require("@slack/bolt");
const app = new App({
  token: "xoxb-1273107934163-1285590347713-IFD6nYKd3E59NMKy3rdr1WSu",
  signingSecret: "4c1f11f5986ab05b95a796b7897e87c3",
});

(async () => {
  // Start your app
  await app.start(3001);

  console.log("⚡️ Bolt app is running!");
})();

// GET /api/recurringevents/
router.get("/test", (req, res) => {
  // const { query } = req;

  findConversation("vrms");
  publishMessage();
});

async function findConversation(name) {
  try {
    // Call the conversations.list method using the built-in WebClient
    const result = await app.client.conversations.list({
      // The token you used to initialize your app
      token: "xoxb-1273107934163-1285590347713-IFD6nYKd3E59NMKy3rdr1WSu",
    });

    for (var channel of result.channels) {
      if (channel.name === name) {
        conversationId = channel.id;

        // Print result
        console.log("Found conversation ID: " + conversationId);
        // Break from for loop
        break;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function publishMessage(id, text) {
  try {
    // Call the chat.postMessage method using the built-in WebClient
    const result = await app.client.chat.postMessage({
      // The token you used to initialize your app
      token: "xoxb-1273107934163-1285590347713-IFD6nYKd3E59NMKy3rdr1WSu",
      channel: "C017L4PFAA3",
      text: "Slack Message Publish",
      // You could also use a blocks[] array to send richer content
    });

    // Print result, which includes information about the message (like TS)
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}
module.exports = router;
