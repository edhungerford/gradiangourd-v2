const axios = require('axios');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .addStringOption(option =>
        option.setName('game')
        .setDescription('The game to fetch information from.')
        .setRequired(true)
        .addChoices(
            { name: 'Tails of Gradia', value: 'gradia' },
			{ name: 'South of Snaplands', value: 'snaplands' },
            { name: 'Scalesagas', value: 'scalesagas'},
			{ name: "Blue Skies, Black Smoke", value: 'bsbs'}
        )
    )
    .setName('recap')
    .setDescription('Finds the most recent recap (default), or a different one by name.')
    .addStringOption(option =>
        option.setName('title')
        .setDescription('The session title')
    ),
    async execute(interaction) {
        const title = interaction.options.getString('title') ?? "latest";
        const game = interaction.options.getString('game');
        const story = await axios.get(process.env['FETCH_BASE'] + game + '/story');
        async function postRecap(storyObject){
            function splitStinger(stinger){
                return stinger.split("\n").map(sting => `> *${sting.replaceAll("\n", "").replaceAll("\r","")}*`).join("\n"); //I don't think \r should be common, but Riley did it once...
            }
            const message = storyObject.story.replaceAll("\n", "\n\n");
            if(message.length > 2000){
                async function chunkify(chunks){
                    let numChunks = Math.floor(chunks.join("").length / 2000) + 1;  // Haha. numChunks.
                    let chunkSize = Math.floor(chunks.length/numChunks);
                    let newChunks = [];
                    if(numChunks > 1){
                        for(var i=0;i<numChunks -1;i++){
                            newChunks[i] = chunks.splice(0,chunkSize).join("\n\n")
                        }
                        newChunks.push(chunks.join("\n\n"))
                    }
                    finalChunks = [];
                    newChunks.forEach(chunk => chunk.length > 2000? finalChunks.push(...chunkify(chunk)) : finalChunks.push(chunk));
                    await interaction.editReply(`# ${storyObject.title}\n\n${finalChunks.shift()}`);
                    finalChunks.forEach(async chunk => await interaction.followUp({ content: `${chunk}\n\n${splitStinger(storyObject.stinger) || ""}`}));
                }
                let splitMessage = message.split("\n\n");
                chunkify(splitMessage);
            } else {
                await interaction.editReply(`# ${storyObject.title}\n\n${message}\n\n${splitStinger(storyObject.stinger)}`);
            }
        }
        if(title !== "latest"){
            var results = story.data.filter(session => {
                return session.title.toUpperCase().startsWith(title.toUpperCase())
            })
            if(results.length > 0){
                postRecap(results[0])
            } else {
                await interaction.editReply("Couldn't find a session with that name.")
            }
        } else {
            postRecap(story.data[story.data.length - 1])
        }
        
    },

}
