const { Telegraf } = require('telegraf');
require('node:process').loadEnvFile();

const bot = new Telegraf(process.env.BOT_TOKEN);

const welcomeMessage = `👋 Welcome to our Investment Channel!
Thank you for joining us.
Interested in our trading services, investment information, or need assistance?
📩 Contact our Admin directly: https://t.me/MitchellVip
We're happy to assist you!`;

bot.start(async (ctx) => {
  await ctx.reply(welcomeMessage);
});

bot.on('chat_join_request', async (ctx) => {
  const request = ctx.update.chat_join_request;

  try {
    // Send the private welcome before approving the request.
    await ctx.telegram.sendMessage(
      request.user_chat_id,
      welcomeMessage
    );

    await ctx.telegram.approveChatJoinRequest(
      request.chat.id,
      request.from.id
    );

    console.log('Welcome sent and join request approved.');
  } catch (error) {
    console.error('Join request processing failed:', error.message);
  }
});

bot.launch()
  .then(() => console.log('Welcome Bot is running!'))
  .catch(console.error);