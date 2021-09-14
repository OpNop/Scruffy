const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Interaction, MessageEmbed } = require('discord.js');
const Api = require('../classes/Api');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lottery')
		.setDescription('View information about the TINY lottery.')
		.addStringOption((option) =>
			option
				.setName('account')
				.setDescription('Check your entries using your Guild Wars account (User Name.1234)')
		),
	/**
	 *
	 * @param {Interaction} interaction
	 */
	execute: async (interaction) => {
		const account = interaction.options.getString('account');
		if (account) {
			await interaction.deferReply({ ephemeral: true });

			const entries = await Api.tiny.getLotteryEntries(account);
			let message = '';

			if (entries.tickets == 0) {
				message = `I cant find any <:lotto_ticket:758522048309362708> for you 😯 If you just deposited, try again in about **5 minutes**.`;
			} else {
				message = `you have ${entries.tickets} <:lotto_ticket:758522048309362708> in this weeks lottery 🎉`;
			}

			interaction.followUp({ content: message, ephemeral: true });

		} else {
			await interaction.deferReply();

			const message = new MessageEmbed()
				.setTitle('TINY Lottery Info')
				.setColor('#daa520')
				.setTimestamp()
				.setImage(`https://api.tinyarmy.org/v1/lottery/pot/image?${Date.now()}`)
				.setFooter('Tiny Lottery Service', 'https://tinyarmy.org/wp-content/uploads/2018/12/fav_57.png')
				.setDescription(`The TINY Lottery is where your dreams can come true
    
                **Basic Rules**
                - 1 entry for every <:gold:687141628636430366> deposited
                - A Maximum of 10 entries can be earned per week per account
                - 3 winners will be pulled during Tiny Takeover Tuesday
                - Entry period is weekly starting from Tuesday at server reset
                
                *Prize amounts are estimates based on **current** entries and are subject to change.`);

			interaction.followUp({ embeds: [message] });
		}

	},
};
