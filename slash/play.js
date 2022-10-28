const {SlashCommandBuilder} = require("@discordjs/builders")
const {MessageEmbed} = require("discord.js")
const {QueryType} = require("discord-player")

module.exports ={
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("lolka")
    .addSubcommand((subcommand) => 
        subcommand.setName("song")
        .setDescription("url song loader")
        .addStringOption((option) => option.setName("url").setDescription("the song's url ").setRequired(true)) 
    )
    .addSubcommand((subcommand) =>
        subcommand
            .setName("playlist")
            .setDescription("playlist")
            .addStringOption((option ) => option.setName("url").setDescription("the playlist's url ").setRequired(true))
    )
    .addSubcommand((subcommand)=> 
        subcommand.setName("search").setDescription("Searchis for song")
        .addStringOption((option)=> option.setName("searchtherms").setDescription("seatch keywords ").setRequired(true)) 
    ),
    run: async ({client, interaction})=> {
        if(!interaction.member.voice.channel)
            return interaction.editReply("szobában kell lenned")

        const queue = await client.player.createQueue(interaction.guild)
        if (!queue.connection) await queue.connect(interaction.member.voice.channel)

        let embed = new MessageEmbed()

        if (interaction.options.getSubcommand()=== "song"){
            let url = interaction.option.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_VIDEO
            })
            if(result.tracks.lenght === 0)
                return interaction.editReply("No result")

            const song = result.tracks[0]
            await queue.add.Track(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** lejátszási listához adva`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Időtartam: ${song.duration}`})


        }else if (interaction.options.getSubcommand()=== "playlist"){
            let url = interaction.option.getString("url")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.YOUTUBE_PLAYLIST
            })
            if(result.tracks.lenght === 0)
                return interaction.editReply("No result")

            const playlist = result.playlist[0]
            await queue.add.Tracks(result.tracks)
            embed
                .setDescription(`**${result.tracks.lenght} zenék innen [${playlist.title}](${playlist.url})** lejátszási listához adva`)
                .setThumbnail(playlist.thumbnail)
                .setFooter({text: `Időtartam: ${playlist.duration}`})
        }else if (interaction.options.getSubcommand()=== "search"){
            let url = interaction.option.getString("searchtherms")
            const result = await client.player.search(url, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            })
            if(result.tracks.lenght === 0)
                return interaction.editReply("No result")

            const song = result.result.tracks[0]
            await queue.add.Track(song)
            embed
                .setDescription(`**[${song.title}](${song.url})** lejátszási listához adva`)
                .setThumbnail(song.thumbnail)
                .setFooter({text: `Időtartam: ${song.duration}`})
        }
        if(!queue.playing) await queue.play()
        await interaction.editReply({
            embeds:[embed]
        })
    }
}