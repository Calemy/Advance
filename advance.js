const bot = require('./src/discord/bot.js');
const cron = require('./src/cron.js');
const database = require('./src/helper/dbHelper.js');

console.log("Starting osu!advance - Version 1.0 (Beta)")
database.connect()
bot();
cron();