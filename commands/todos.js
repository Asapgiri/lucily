module.exports = {
    name: 'todos',
    usage: 'hidden',
    description: "A list of to-do-s.",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setTitle("Lucys masters To-do-s:")
        .setDescription(`\`\`\`Játék menüt megcsinálni..\n` +
        `radio megoldása..\n` +
        `hmmmm\`\`\``)
        );
    }
}