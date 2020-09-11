module.exports = {
    name: 'skip',
    usage: 'music',
    description: "Ez egy skip :3!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        const ytdl = require('ytdl-core');
        var server = servers[message.guild.id];
        
        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setDescription('Skipping [' + server.datas[0].title + '](' + server.datas[0].url + ')'))
        .then(msg => {
            msg.delete({ timeout: 7000 })
        });
        
        if (server.dispatcher) server.dispatcher.end();
        else console.log('error dispacher end.');
    }
}