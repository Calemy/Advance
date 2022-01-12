const bot = require('./src/discord/bot.js');
const cron = require('./src/cron.js');
const database = require('./src/helper/dbHelper.js');

const express = require('express')
const app = express()
const port = 9000

app.listen(port)

console.log("Starting osu!advance - Version 1.0 (Beta)")
database.connect()
bot();
cron();