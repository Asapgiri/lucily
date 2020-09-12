module.exports = {
    name: 'gt',
    usage: 'music',
    description: "Says in google translate message from the args..!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        if (args[0]) {
            message.member.voice.channel.join().then(function(connection) {
                connection.play(`http://translate.google.com/translate_tts?ie=UTF-8&total=1&idx=0&textlen=32&client=tw-ob&q=${args.join('%20')}?&tl=hu-hu`).on("finish", () => {
                    servers[message.guild.id] = null;
                    connection.disconnect();
                });
            });
            //else
            //message.channel.send(new Discord.MessageEmbed()
            //.setColor('#d497e9')
            //.setImage('https://media1.tenor.com/images/7b25f540db61fa86ed3677835a5ca304/tenor.gif?itemid=14855710')
            //.setTitle('The bot is connected elswhere on this server..'));
        }
        else {
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setImage('https://media1.tenor.com/images/7b25f540db61fa86ed3677835a5ca304/tenor.gif?itemid=14855710')
            .setTitle('I can\'t speak when you don\'t say what to.. so sorry.'));
        }



    }
}