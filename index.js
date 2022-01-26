/** @name Dependencies */
const http = require('http');
const express = require('express')
const app = express();
const Discord = require('discord.js');
const client = new Discord.Client();
const server = http.createServer(app);
/** @name Internal */
require('dotenv').config();
import Formats from 'util/formats';
const Includes = require('./includes/ready');

app.get('/', (req, res) => res.status(200).send('BOT => [ok]'));

client.on('ready', () => {
    console.log('[Discord Status] => Ok');
});

client.on('message', (msg) => {
    const command = Formats.string(msg.content);
    Includes.READY(command, msg);
});

client.login(process.env.TOKEN_DISCORD);
server.listen(process.env.PORT || 8877, () => console.log('BOT => STARTED'));
