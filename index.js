require('dotenv').config();
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const token = process.env['DISCORD_TOKEN'];
const clientId = process.env['CLIENT_ID'];
const guildId = process.env['SERVER_ID'];

const bot = new Client({intents: [GatewayIntentBits.Guilds] });
bot.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

bot.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			bot.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
 
bot.on('ready', function() {
    console.log('Logged in as %s.\n', bot.user.tag);
});

bot.login(token);

bot.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()){
	
		const command = interaction.client.commands.get(interaction.commandName);
		await interaction.deferReply();

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	} 
});

