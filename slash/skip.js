const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("skip")
        .setDescription("Skips the bot and clears the queue"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)
            return await interaction.editReply("Nincsenek zenék a listán")

            const currentSong = queue.current

            queue.skip()
            await interaction.editReply({
                embeds:[
                    new MessageEmbed().setDescription(`${currentSong.title} skipped `).setThumbnail(currentSong.setthumbnail)
                ]
            })
    }
}