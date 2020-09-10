module.exports = {
    name: 'help',
    description: "Shows this help message.. :3!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        var text = "";

        args.forEach(element => {
            text += element.name + ': \t' + element.description + '\n';
        });

        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setTitle("Help:")
        .setDescription(text)
        );
    }
}