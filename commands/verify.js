const { SlashCommandBuilder } = require('@discordjs/builders');
// eslint-disable-next-line no-unused-vars
const { MessageEmbed, Interaction } = require('discord.js');
const { welcome_room, log_room, member_role, guilds } = require('../config.json');
const logger = require('../classes/Log');
const Api = require('../classes/Api');
const keyFormat = /([A-Z0-9]{8}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{20}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{12})/;

const linkSuccess = (user, account, key) => {
	return new MessageEmbed()
		.setDescription(`✅ Successfully linked ${user} to \`${account}\` \nUsing key: \`${key}\``)
		.setColor(8311585);
};

/**
 *
 * @param {Interaction} interaction
 */
const doStart = async (interaction) => {
	const embed = new MessageEmbed()
		.setTitle('Setup Guide')
		.setDescription('🎉 Huzzah!! Linking your account is the best way to enhance your TINY Adventure!!\n Lets get this party started!')
		.setColor('#6a1b9a')
		.addField('Step 1', 'Go to https://account.arena.net/applications/create')
		.addField('Step 2', 'Choose a name for the key, something like "TINY Discord"')
		.addField('Step 3', 'Make sure to select `account` and `characters` and click Create API Key')
		.addField('Step 4', 'Back in discord, use the command `/verify addkey` to add your key');
	interaction.reply({ embeds: [embed], ephemeral: true });
};

/**
 *
 * @param {Interaction} interaction
 */
const doAddKey = async (interaction) => {

	// Set Defer for long tasks
	await interaction.deferReply({ ephemeral: true });

	const key = interaction.options.getString('key');
	const user = interaction.user;
	const member = interaction.guild.members.cache.get(user.id);

	// Check key length and format
	if (key.length != 72 && keyFormat.test(key) == false) {
		interaction.followUp({
			content: 'That seems to be an invalid API key. Please try again.',
			ephemeral: true,
		});
		return;
	}
	/**
	 * Order of opperstions
	 *
	 * 1) Check key for permissions
	 * 2) Get account name from key
	 *
	 */
	// Check that key has right perms (account and character)
	if (await Api.gw2.checkKey(key)) {
		// Valid perms
		// Get Account
		const account = await Api.gw2.getAccount(key);

		// Validate that they are in a TINY guild
		if (isInGuild(account) === false) {
			// Non guild member
			interaction.followUp('🚨 Bookah Alert!! 🚨\n\nYou are not a [TINY] member!\n\nIf you really are, try again in a little bit or let us know there is an issue.');
			return;
		}

		// Link discord
		if (await Api.tiny.addDiscord(account.name, user.id)) {
			// Save Key
			if (await Api.tiny.addKey(account.name, key)) {
				// Set roles
				await setRoles(account, member);
				logger.Log(`Linked: ${user.tag} to ${account.name}`);
				interaction.followUp({ embeds: [linkSuccess(user, account.name, key)], ephemeral: true });
				interaction.client.channels.cache.get(log_room).send({ embeds: [linkSuccess(user, account.name, key)] });
				interaction.client.channels.cache.get(welcome_room).send(`Welcome to yellow name ${user}!!!!`);
			} else {
				logger.Error(`Error during Api.tiny.addKey for user ${user}`);
				interaction.followUp({ content: 'Error Linking', ephemeral: true });
			}
		} else {
			logger.Error(`Error during Api.tiny.addDiscord for user ${user}`);
			interaction.followUp({ content: 'Error Linking', ephemeral: true });
		}
	} else {
		// invalid perms
		interaction.followUp({
			content: 'Your API key needs to include `characters` permission',
			ephemeral: true,
		});
	}
};

const isInGuild = (account) => {
	for (const guild of guilds) {
		if (account.guilds.includes(guild.id)) {
			return true;
		}
	}
	return false;
};

const setRoles = async (account, member) => {
	// Give main Member Role
	await member.roles.add(member_role);

	// Apply guild Rols
	for (const guild of guilds) {
		if (account.guilds.includes(guild.id)) {
			await member.roles.add(guild.role);
		}
	}
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verify your account as a [TINY] member')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('addkey')
				.setDescription('Verify your account using a GW2 API key')
				.addStringOption((option) =>
					option
						.setName('key')
						.setDescription('Your GW2 API Key')
						.setRequired(true))
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('start')
				.setDescription('Get started verifying your account')
		),

	/**
	 *
	 * @param {Interaction} interaction
	 */
	execute: async (interaction) => {
		switch (interaction.options.getSubcommand()) {
			case 'addkey':
				logger.Log(`User: ${interaction.user.tag} ran the command: ${interaction.commandName} ${interaction.options.getSubcommand()} ${interaction.options.getString('key')} `);
				await doAddKey(interaction);
				break;
			case 'start':
				logger.Log(`User: ${interaction.user.tag} ran the command: ${interaction.commandName} ${interaction.options.getSubcommand()}`);
				await doStart(interaction);
				break;
		}
	},
};
