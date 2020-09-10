module.exports = {
    name: 'bazdmegh',
    description: "Ez egy lebaszás! (magadnak maybe)",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const randomnb = Math.floor(Math.random() * 5);
        var text;
        var user;
        if (!args[0]) {
            user = message.author.toString();
        } else {
            user = args[0];
        }

        switch (randomnb) {
            case 0: text = 'Baszódj meg' + user + '! :)) '; break;
            case 1: text = 'Ó hogy szopd le a faszt ' + user + '! :)) '; break;
            case 2: text = 'Verjem beléd ' + user + '! :)) '; break;
            case 3: text = 'Meleg vagy ' + user + '! :)) '; break;
            case 4: text = 'Meghaltál ' + user + '! :)) ~from: Sasori88'; break;
        }
        message.channel.send(new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setDescription(text));
    }
}