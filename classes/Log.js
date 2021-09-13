// eslint-disable-next-line no-unused-vars
const colors = require('colors');
const fs = require('fs');

const log_file = fs.createWriteStream(process.cwd() + '/debug.log', { flags : 'w' });

const formatMessage = (type, message) => {
	const output = `[${type.toUpperCase()}](${new Date(Date.now()).toLocaleTimeString([], {
		hour12: false,
		timeZone: 'America/Phoenix',
		timeZoneName: 'short',
	})}) - ${message}`;
	log_file.write(output + '\n');
	return output;
};

module.exports = {
	Log(message) {
		console.log(formatMessage('info', message).white);
	},
	Warn(message) {
		console.log(formatMessage('warn', message).yellow);
	},
	Error(message) {
		console.log(formatMessage('error', message).red);
	},
	Debug(message) {
		console.log(formatMessage('debug', message).green);
	},
};
