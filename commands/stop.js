module.exports = {
    name: 'stop',
    description: "Ez egy stop :3!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        var server = servers[message.guild.id];
        if (message.guild.voice) {
            for (var i = server.queue.length - 1; i>=0; i--) {
                server.queue.splice(i, 1);
            }

            server.dispatcher.end();
            //message.guild.voice.connection.disconnect();
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setDescription('Kilépés ...')
            );
        } else {
            message.channel.send('It is bugs...');
        }
    }
}