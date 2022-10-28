const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("shuffle")
        .setDescription("Shuffles the bot and clears the queue"),
    run: async ({client, interaction}) => {
        const queue = client.player.getQueue(interaction.guildId)

        if(!queue)
            return await interaction.editReply("Nincsenek zenék a listán")

            queue.shuffle()
            await interaction.editReply(`A lista ${queue.tracks.length} shuffled !`)
    },
}