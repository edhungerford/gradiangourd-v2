const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('character')
		.setDescription('Finds a character by name.')
		.addStringOption(option => 
			option.setName('name')
			.setDescription('The name of the character')
			.setRequired(true))
		.addStringOption(option =>
			option.setName('game')
			.setDescription("The TTRPG game you're querying")
			.setRequired(true)
			.addChoices(
					{ name: 'Tails of Gradia', value: 'gradia' },
					{ name: 'South of Snaplands', value: 'snaplands' },
					{ name: 'Scalesagas', value: 'scalesagas'},
					{ name: "Blue Skies, Black Smoke", value: 'bsbs'}
				)
			),			
	async execute(interaction) {
		const name = interaction.options.getString('name');
		const game = interaction.options.getString('game');
		const char = await axios.get(`${process.env['FETCH_BASE']}${game}/characters`);
		var results = char.data.filter(character => {
			return character.name.toUpperCase().startsWith(name.toUpperCase());
		})
		if(results.length > 0){
			const card = {
				color: 0xca4a00,
				title: results[0].name,
				image: {'url': results[0].url},
				description: results[0].description,
				fields: [{name: 'Pronouns', value: results[0].pronouns}]
			}
			await interaction.editReply({embeds: [card]});
			if(results.length > 1) await interaction.followUp({content: "I found more than one character that matched your search parameters. If this isn't the character you were looking for, try being a little more specific!", ephemeral: true});
		} else {
			await interaction.editReply("Couldn't find a character with that name.");
		}
	},
};
