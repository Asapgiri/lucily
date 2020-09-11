module.exports = {
    name: 'stop',
    usage: 'music',
    description: "Ez egy stop :3!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        var server = servers[message.guild.id];
        if (message.guild.voice) {
            for (var i = server.queue.length - 1; i>=0; i--) {
                server.queue.splice(i, 1);
            }

            server.dispatcher.end(false, true);
        } else {
            message.channel.send('It is bugs...');
        }
    }
}