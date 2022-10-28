const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { run } = require("./play");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("queue")
    .setDescription("display the current song queue")
    .addNumberOption((option) => option.setName("page").setDescription("Page the number of the queue").setMinValue(1)),

    run: async ({ client, interraction }) => {
        const queue = client.qetQueue(interraction.guildId)
        if(!queue || !queue.playing ){
            return await interraction.editReply("Nincs zene a queue-ban")
        }

        const totalPages = Math.ceil(queue.tracks.length /10 ) || 1
        page = (interraction.options.getNumber("page")|| 1) - 1 

        if(page > totalPages)
            return await interraction.editReply(`Helytelen oldal. Összesen ${totalPages} oldal van`) 
        
        const queueString = queue.tracks.slice(page*10, page*10 + 10).map((song, i) => {
            return `**${page*10 + i + 1 }. \`[${song.duration}]\`${song.title} -- <@${song.requestedBy.id}>`
        })

        const currentSong = queue.current

        await interraction.editReply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`**Most hallgatod**\n` + 
                    (currentSong ? `\` [${currentSong.duration}]\` ${currentSong.title} -- <@${currentSong.requestedBy.id}>` : "None")
                    `\n\n**Queue**\n${queueString}`
                    )
                    .setFooter({
                        text: `Oldal ${page + 1} a(z) ${totalPages}ból`
                    })
                    .setThumbnail(currentSong.setthumbnail)
            ]
        })
    }   
}