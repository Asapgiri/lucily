module.exports = {
    name: 'mention',
    usage: 'base',
    description: "Ez megemlít mindenkit külön külön :)",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        var text = message.author.toString() + ' mentiond: ';
        var embed = false;
        if (!args[0]) {
            message.guild.members.cache.forEach(member => {
                if (member.id != message.author.id) text += member.toString() + ' ';
            });
        } else if (args[0] == 'online') {
            message.guild.members.cache.forEach(member => {
                if (member.id != message.author.id && member.presence.status == 'online') text += member.toString() + ' ';
            });
        } else if (args[0] == 'idle') {
            message.guild.members.cache.forEach(member => {
                if (member.id != message.author.id && member.presence.status == 'idle') text += member.toString() + ' ';
            });
        } else if (args[0] == 'dnd') {
            message.guild.members.cache.forEach(member => {
                if (member.id != message.author.id && member.presence.status == 'dnd') text += member.toString() + ' ';
            });
        } else if (args[0] == 'offline') {
            message.guild.members.cache.forEach(member => {
                if (member.id != message.author.id && member.presence.status == 'offline') text += member.toString() + ' ';
            });
        } else if (args[0] == 'status') {
            var online = "", idle = "", dnd = "", offline = "";
            message.guild.members.cache.forEach(member => {
                if (member.presence.status == 'online') online += `${member.user} (${member.presence.status})\n`;
                else if (member.presence.status == 'dnd') dnd += `${member.user} (${member.presence.status})\n`;
                else if (member.presence.status == 'idle') idle += `${member.user} (${member.presence.status})\n`;
                else offline += `${member.user} (${member.presence.status})\n`;
            });
            text = `**Online::**\n${online}\n**Idle::**\n${idle}\n**Do not didsturb::**\n${dnd}\n**Offline::**\n${offline}`;
            embed = true;
        } else {
            args.forEach(member => {
                text += member.toString() + ' ';
            });
        }
        if (embed) {
            message.channel.send(new Discord.MessageEmbed()
            .setColor(Math.floor(Math.random()*16777215).toString(16))
            .setTitle('Lő Statuses!')
            .setDescription(text));
        } else {
            message.channel.send(text);
        }
    }
}