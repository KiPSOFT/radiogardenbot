const Commands = require('./lib/commands');
const Bot = require('./lib/bot');
// require('dotenv').config();

const commands = new Commands();
new Bot(commands);
console.log('Bot launching...');