const axios = require('axios');
const { SlashCommandBuilder, bold, quote } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('list')
    .setDescription('Lists characters or sessions.')
    .addStringOption(option =>
        option.setName('type')
        .setDescription('The kind of list to fetch.')
        .setRequired(true)
        .addChoices({
            name: 'Characters', value: 'characters'
        },
        {
            name: 'Sessions', value: 'story'
        })
    )
    .addStringOption(option =>
        option.setName('game')
        .setDescription('The game to fetch information from.')
        .setRequired(true)
        .addChoices(
            { name: 'Tails of Gradia', value: 'gradia' },
			{ name: 'South of Snaplands', value: 'snaplands' },
			{ name: 'Scalesagas', value: 'scalesagas'},
			{ name: "Blue Skies, Black Smoke", value: 'bsbs'}
        ),
    ),
    async execute(interaction){
        const type = interaction.options.getString('type');
        const game = interaction.options.getString('game');
        var list = await axios.get(process.env['FETCH_BASE'] + game + '/' + type);
        let listString = "";
        if(interaction.options.getString('type') === "characters"){
            let affiliations = Array.from(new Set(list.data.map(character => character.affiliation)))
            
            affiliations.forEach(affiliation => {
                listString += bold(affiliation) + "\n";
                let members = list.data.filter(character => {
                    return character.affiliation === affiliation;
                })
                members.forEach(member => {
                    listString += quote(member.name) + "\n"
                })
            })
        } else if(interaction.options.getString('type') === "story"){
            let acts = Array.from(new Set(list.data.map(session => session.act)))

            acts.forEach(act => {
                listString += bold(act) + "\n";
                let sessions = list.data.filter(session => {
                    return session.act === act;
                })
                sessions.forEach(session => {
                    listString += quote(session.title) + "\n"
                })
            })
        }
        interaction.editReply(listString)
    }
}