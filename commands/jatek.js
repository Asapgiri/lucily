module.exports = {
    name: 'jatek',
    description: "Jáccunk egy játékot :3!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        var randomColor = Math.floor(Math.random()*16777215).toString(16);
        message.channel.send(new Discord.MessageEmbed()
        .setColor(randomColor)
        .setDescription('Wanna play a game? hehe'));
    }
}