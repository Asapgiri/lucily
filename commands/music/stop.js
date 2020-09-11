module.exports = {
    name: 'stop',
    usage: 'music',
    description: "Ez egy stop :3!",
    execute(message, args, servers) {
        var server = servers[message.guild.id];
        if (message.guild.voice) {
            try {
                server.datas.splice(server.datas.length - 1, 1);
                for (var i = server.queue.length - 1; i>=0; i--) {
                    server.queue.splice(i, 1);
                    server.datas.splice(i, 1);
                }
                //server.botKilled = true;
                server.dispatcher.end();
            }
            catch {
                message.guild.voice.connection.disconnect();
            }
        } else {
            message.channel.send('I\'m not in a voice channel ...');
        }
    }
}