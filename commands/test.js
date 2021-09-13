const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const got = require('got');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('taimi_says')
		.setDescription('Replies with random dialog from https://taimi.jumpsfor.science/'),
	execute: async (interaction) => {
		const res = await got('https://taimi.jumpsfor.science/getMarkov').json();

		// const row = new MessageActionRow().addComponents(
		// 	new MessageButton().setCustomId('continue')
		// 		.setLabel('Go on...')
		// 		.setStyle('PRIMARY'),
		// 	new MessageButton().setCustomId('exit')
		// 		.setLabel('Got it, Taimi.')
		// 		.setStyle('SECONDARY')
		// );

		const embed = new MessageEmbed()
			.setTitle('The Taimi Says....')
			.setURL('https://taimi.jumpsfor.science/')
			.setColor('#962eff')
			.setDescription(res.string)
			.setThumbnail('https://taimi.jumpsfor.science/img/taimi.png');

		await interaction.reply({
			embeds: [embed],
			// components: [row],
		});

		// const collector = interaction.channel.createMessageComponentCollector({
		// 	componentType: 'BUTTON',
		// 	time: 10000,
		// });

		// collector.on('collect', (i) => {
		// 	console.log(i);
		// 	if (i.user.id === interaction.user.id) {
		// 		i.reply(`${i.user.username} clicked on the ${i.customId} button.`);
		// 	} else {
		// 		i.reply({
		// 			content: "These buttons aren't for you!",
		// 			ephemeral: true,
		// 		});
		// 	}
		// });

		// collector.on('end', (collected) => {
		// 	console.log(`Collected ${collected.size} interactions.`);
		// });
	},
};
