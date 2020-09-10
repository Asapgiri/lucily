module.exports = {
    name: 'queue',
    description: "Ez egy queue :3!",
    execute(message, args, server) {
        const Discord = require('discord.js');
        const ytdl = require('ytdl-core');
        var text = "", i = 0;

        if (server.datas.forEach(info => {
            text += '**' + ++i + '**.: **[' + info.title + '](' + info.url + ')' + ((i==1) ? ' -> \[now playing\]' : '') + '**\n';
        })) {
            text = "No songs to show.";
        }

        console.log(text);

        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setTitle('Queue(' + i + '):')
        .setDescription(text));

    }
}