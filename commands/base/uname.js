module.exports = {
    name: 'uname',
    usage: 'base',
    description: "Sets a users nickname :3!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        var uname;
        if (!args[0]) {
            message.guild.member(message.author).setNickname('Meleg vagyok!');
            uname = message.author;
        } else if (!args[1]) {
            message.guild.member(message.mentions.users.first()).setNickname('Meleg vagyok!');
            uname = args[0];
        } else {
            message.guild.member(message.mentions.users.first()).setNickname(args[1]);
            uname = args[0];
        }



        message.channel.send(new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setDescription(uname + ' changed..'));
    }
}