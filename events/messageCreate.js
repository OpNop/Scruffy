// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');
const fs = require('fs');

const chatLog = fs.createWriteStream(process.cwd() + '/chat.log', { flags : 'a' });

module.exports = {
	name: 'messageCreate',

	/**
	* @param {Message} message
	*/
	execute(message) {
		const roles = message.member.roles.cache.map(r => r.name).join(', ');
		const attachments = message.attachments.size > 0 ? message.attachments.first().url : '';
		const chat = `${message.createdAt.toISOString()}, ${message.author.tag}, "${roles}", ${message.channel.name}, ${message.cleanContent}, ${attachments}`;

		chatLog.write(chat + '\n');
		console.log(chat);
	},
};