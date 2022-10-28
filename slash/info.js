const { SlashCommandBuilder } = require("@discordjs/builders");
const {MessageEmbed} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info")
        .setDescription("Displays info abput the a songs"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)
            return await interaction.editReply("Nincsenek zenék a listán")

            let bar = queue.createProgressBar({
                queue: false,
                length: 19
            })
            await interaction.editReply({
                embeds: [new MessageEmbed()
                .setThumbnail(song.thumbnail)
                .setDescription(`Most játszott [${song.title}](${song.url})\n\n`+ bar)],
            })
    }
}