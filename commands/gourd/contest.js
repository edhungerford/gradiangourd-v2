const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('contest')
		.setDescription('A contest between two characters. Vote for the winner!')
		.addStringOption(option =>
            option.setName("question")
            .setDescription("The question at hand.")
            .setRequired(true))
        .addStringOption(option => 
			option.setName("name_one")
			.setDescription("The name of the first character.")
			.setRequired(true))
        .addStringOption(option =>
            option.setName("name_two")
			.setDescription("The name of the second character.")
			.setRequired(true))
		.addStringOption(option =>
			option.setName("game")
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
		const name1 = interaction.options.getString('name_one');
        const name2 = interaction.options.getString('name_two');
		const game = interaction.options.getString('game');
        const question = interaction.options.getString('question');
		const char = await axios.get(`${process.env['FETCH_BASE']}${game}/characters`);
        var results = char.data.filter(character =>{
            return character.name.toUpperCase().startsWith(name1.toUpperCase()) || character.name.toUpperCase().startsWith(name2.toUpperCase());
        })
        if(results.length != 2){
            interaction.editReply("Found " + (results > 2? "more" : "fewer") + " than two characters."); //If more or fewer than two characters are returned, something went wrong.
            return;
        }
        if(results.length == 0){
            interaction.editReply("Found no characters matching those parameters."); //Obviously, if it finds no characters, that's a problem.
        }
        if(results.length > 0){
            results = results.sort((a,b) => {
                if(a.name == name1) return 1;
                return -1;
            }).map(function(result) {
                return ({
                    title: result.name,
                    image: {'url': result.url},
		            description: result.description,
		            fields: [{name: 'Pronouns', value: result.pronouns}]
                })
            })
            results[0].color = 0xd42114;
            results[1].color = 0x2114d4;
            let now = new Date();
            const poll = {
                question: {
                    text: question
                },
                answers: [{
                    answer_id: 1,
                    text: results[0].title 
                },
                {
                    answer_id: 2,
                    text: results[1].title
                }],
                duration: 3
                }

            interaction.editReply({embeds: results, poll: poll});
        }
        if(results.length == 0) interaction.editReply("Couldn't find a character with that name.");
	},
};