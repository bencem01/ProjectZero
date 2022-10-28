const { SlashCommandBuilder } = require("@discordjs/builders");
const { Track } = require("discord-player");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skipto")
        .setDescription("Skips to the bot and clears the queue")
        .addNumberOption((option) => 
            option.setName("tracknumber").setDescription("The track to skip to").setMinValue(1).setRequired(true)),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)
            return await interaction.editReply("Nincsenek zenék a listán")

            const trackNum = interaction.options.getNumber("tracknumber")
            if(trackNum > queue.tracks.length)
                return await interaction.editReply("Invalid track number")
            queue.skipto(trackNum - 1)
            await interaction.editReply(`skipped ahead ${trackNum}`)
    }
}