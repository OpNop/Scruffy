const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { Interaction } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pingcontrol')
		.setDescription('Do you want @everyone pings?')
		.addStringOption(option =>
			option.setName('mode')
				.setDescription('Enable or disable @everyone pings')
				.setRequired(true)
				.addChoice('Enable', 'Enabled')
				.addChoice('Disable', 'Disabled')),
	/**
	 *
	 * @param {Interaction} interaction
	 */
	execute: async (interaction) => {
		const mode = interaction.options.getString('mode');
		const member = interaction.guild.members.cache.get(interaction.user.id);
		const role = interaction.guild.roles.cache.find((r) => r.name == 'everybody');

		if (mode == 'Enabled') {
			member.roles.add(role);
		} else {
			member.roles.remove(role);
		}
		await interaction.reply({
			content: `Ok server pings set to ${interaction.options.getString('mode')}`,
			ephemeral: true,
		});
	},
};
