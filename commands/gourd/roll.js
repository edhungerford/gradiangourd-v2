const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Rolls some dice.')
    .addIntegerOption(option =>
        option.setName('number')
        .setDescription('The amount of dice to roll.')   
        .setRequired(true)
    )
    .addIntegerOption(option => 
        option.setName('sides')
        .setDescription('The number of sides on the dice.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
        option.setName('modifier')
        .setDescription('The modifier to add to the final roll.')),
    async execute(interaction){
        const number = interaction.options.getInteger('number');
        const sides = interaction.options.getInteger('sides');
        const modifier = interaction.options.getInteger('modifier') ?? 0;
        var result = {
            final: 0,
            rolls: []
        };

        for(let i = 0; i < number; i++){
            let roll = Math.ceil(Math.random() * sides);
            result.final += roll;
            result.rolls.push(roll);

        }
        result.final += modifier;
        function printRolls(rolls){
            let rollString = "";
            rolls.forEach(roll => {
                rollString += `[${roll.toString()}] `
            });
            return rollString.length > 30 ? rollString.substring(0,30) : rollString;
        }
        interaction.editReply(`You rolled a ${result.final}. \`${printRolls(result.rolls)}+ ${modifier}\``);
    }
}