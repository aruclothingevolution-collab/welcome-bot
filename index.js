
const { Telegraf } = require('telegraf');
const http = require('node:http');
const fs = require('node:fs');

if (fs.existsSync('.env')) {
  process.loadEnvFile('.env');
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('Welcome to End With Michelle!');
});

const port = Number(process.env.PORT || 3000);
const webhookPath = '/telegram-webhook';

const server = http.createServer(async (req, res) => {
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200);
    res.end('Telegram bot is running');
    return;
  }

  if (req.url !== webhookPath || req.method !== 'POST') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  try {
    let body = '';
    for await (const chunk of req) {
      body += chunk;
    }

    await bot.handleUpdate(JSON.parse(body));
    res.writeHead(200);
    res.end('OK');
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end('Error');
  }
});

async function start() {
  server.listen(port, '0.0.0.0');

  if (process.env.RENDER_EXTERNAL_URL) {
    await bot.telegram.setWebhook(
      process.env.RENDER_EXTERNAL_URL + webhookPath
    );
    console.log('Webhook configured');
  } else {
    await bot.launch();
    console.log('Bot running locally');
  }
}

start().catch(console.error);
