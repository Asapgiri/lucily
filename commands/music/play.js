module.exports = {
    name: 'play',
    usage: 'music',
    description: "Ez egy lejátszás!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        const ytdl = require('ytdl-core');
        const json = require('get-json');
        const ytsearch = require('youtube-search');
        const async = require('async');
        
        function queueAndInfo(title, url, isPlaylist = false) {
            var server = servers[message.guild.id];
            server.queue.push(url);
            server.datas.push({
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
                console.log(`${message.guild.name} - Lejátszási listához hozzáadva: ${title} : ${url}`)
                if (!isPlaylist)
                message.channel.send(new Discord.MessageEmbed()
                    .setColor('#d497e9')
                    .setDescription('Listához hozzáadva **[' + title + '](' + url + ')**'))
                    .then(msg => {
                        msg.delete({ timeout: 7000 })
                      });
            }
        }
        
        function play(connection, message, isPlaylist = false) {
            var server = servers[message.guild.id];
            console.log(message.guild.name + ' - Playing: ' + server.datas[0].title + ' : ' + server.datas[0].url);
            while (!(server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"})))) 
                console.log('Music download ytdl ERROR.');
            if (!isPlaylist)
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setDescription('Playing: **[' + server.datas[0].title + '](' + server.datas[0].url + ')**'));
            else
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setDescription('Playing: **[' + server.datas[0].title + '](' + server.datas[0].url + ')**'))
            .then(msg => {
                msg.delete({ timeout: 7000 })
            });

            server.queue.shift();
            
            
            server.dispatcher.on("finish", (isPlaylist = false) => {
                server.datas.shift();
                if (server.queue[0]) {
                    play(connection, message, isPlaylist);
                    
                } else {
                    if (!server.botKilled) {
                        setTimeout(function() {
                            if (message.guild.voice) {
                                message.guild.voice.connection.disconnect();
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#d497e9')
                                .setDescription('Disconnecting ... timeout'))
                                .then(msg => {
                                    msg.delete({ timeout: 30000 })
                                });
                            }
                        }, 900000);
                    }
                    else {
                        message.guild.voice.connection.disconnect();
                        message.channel.send(new Discord.MessageEmbed()
                        .setColor('#d497e9')
                        .setDescription('Disconnecting ...'))
                        .then(msg => {
                            msg.delete({ timeout: 30000 })
                        });
                        server.botKilled = false;
                    }
                }
            });
        }

        if (!args[0]) {
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setDescription('Nincs url!'));
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
            datas: [],
            botKilled: false
        }
        var server = servers[message.guild.id];
        var url, urls = false;

        //function PlaylistError(msg) {message=msg}

        async function surl(args) {
            try {
                new URL(args[0]);
                if (args[0].includes("playlist")) throw 'It is a playlist!!';
                url = args[0];
            } catch (e) {
                if (!args[0].includes("playlist")) {
                    //console.log(e);
                    url = (await ytsearch(args.join(' '), {maxResults:1, key: process.env.googleyt_api_token })).results[0].link;
                    //console.log(url);
                }
                else if (args[0].includes("playlist")) {
                    urls = true;
                    args[0].split('?').forEach(item => {
                        if (item.startsWith('list')) {
                            json(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=${(args[1]) ? args[1] : 15}&playlistId=${item.split('=')[1]}&key=${process.env.googleyt_api_token}`, (err, data) => {
                                message.channel.send(new Discord.MessageEmbed()
                                .setColor('#d497e9')
                                .setDescription(`Getting Music imput (${data.items.length} - to be sure.)\n${(args[1]) ? '' : '(if you want more (or less) write it after the playlist url. :))'}`))
                                .then(msg => {
                                    msg.delete({ timeout: 7000 })
                                });
                                async.eachSeries(data.items, (yvid, next) => {
                                    var url = yvid.snippet.resourceId.videoId;
                                    ytdl(url).on('info', (song) => {
                                        queueAndInfo(song.videoDetails.title, song.videoDetails.video_url, true);
                                        next();
                                        if (song.videoDetails.videoId == data.items[data.items.length -1].snippet.resourceId.videoId) {
                                            message.listQueue.execute(message, args, servers[message.guild.id])
                                        }
                                    });
                                });
                            });
                            return;
                        }
                    });
                }
                else {
                    console.log(e);
                    throw e;
                }
            }

            if (!urls) {
                ytdl(url).on('info', (song) => {
                    //console.log('Playing: ' + song.videoDetails.title + ' : ' + song.videoDetails.video_url);
                    queueAndInfo(song.videoDetails.title, song.videoDetails.video_url);
                });
            }
        }
        surl(args).catch(err => message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setImage('https://media1.tenor.com/images/7b25f540db61fa86ed3677835a5ca304/tenor.gif?itemid=14855710')
        .setTitle(err)));
    }
}