module.exports = {
    name: 'play',
    description: "Ez egy lejátszás!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        const ytdl = require('ytdl-core');
        const ytsearch = require('youtube-search');
        
        function queueAndInfo(title, url) {
            servers[message.guild.id].datas.push({
                title: title,
                url: url
            });
            if (!message.guild.voice) {
                message.member.voice.channel.join().then(function(connection) {
                    play(connection, message);
                    //console.log(message.guild.voice.connection);
                });
            } else if (!message.guild.voice.connection) {
                message.member.voice.channel.join().then(function(connection) {
                    play(connection, message);
                    //console.log(message.guild.voice.connection);
                });
            } else {
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('#d497e9')
                    .setDescription('Listához hozzáadva **[' + title + '](' + url + ')**'));
            }
        }
        
        function play(connection, message) {
            var server = servers[message.guild.id];
            server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
            ytdl(server.queue[0]).on('info', (song) => {
                console.log(song.videoDetails.title + ' : ' + song.videoDetails.video_url);
                message.channel.send(new Discord.MessageEmbed()
                .setColor('#d497e9')
                .setDescription('Playing: **[' + song.videoDetails.title + '](' + song.videoDetails.video_url + ')**'));
            });

            server.queue.shift();
            
            
            server.dispatcher.on("finish", () => {
                server.datas.shift();
                if (server.queue[0]) {
                    play(connection, message);
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#d497e9')
                    .setDescription('Playing next song ...')
                    );
                } else {
                    message.guild.voice.connection.disconnect();
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#d497e9')
                    .setDescription('Disconnecting ...'));
                }
            });
        }

        if (!args[0]) {
            message.channel.send('Nincs url!');
            return;
        }

        if (!message.member.voice.channel) {
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setDescription('Voic channelbe kell lenned, hohy használhasd ezt a parancsot!!')
            );
            return;
        }

        if (!servers[message.guild.id]) servers[message.guild.id] = {
            queue: [],
            datas: []
        }
        var server = servers[message.guild.id];
        var url;

        async function surl(args) {
            try {
                var u = new URL(args[0]);
                url = args[0];
            } catch (e) {
                console.log(e);
                url = await (await ytsearch(args.join(' '), {maxResults:1, key:'AIzaSyBrNXND0o93shYR3jmNaDMe7DtxOspkDNY'})).results[0].link;
                console.log(url);
            }
            
        server.queue.push(url);
        ytdl(url).on('info', (song) => {
            console.log(song.videoDetails.title + ' : ' + song.videoDetails.video_url);
            queueAndInfo(song.videoDetails.title, song.videoDetails.video_url);
        });
    }
    surl(args);
    }
}