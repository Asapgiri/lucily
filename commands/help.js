module.exports = {
    name: 'help',
    usage: 'base',
    description: "Shows this help message.. :3!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const descFar = 13;
        var usages = {}, types = [];
        var text = "";

        function tabs(val, n, c) {
                if ( Math.abs(n) <= val.length ) {
                        return val;
                }
                var m = Math.max((Math.abs(n) - val.length) || 0, 0);
                var pad = Array(m + 1).join(String(c || ' ').charAt(0));
        //      var pad = String(c || ' ').charAt(0).repeat(Math.abs(n) - this.length);
        //      return (n < 0) ? pad + val : val + pad;
                return pad;
        };

        args.forEach(element => {
            if (element.usage != 'hidden')
            if (usages[element.usage]) usages[element.usage] += `${message.prefix}${element.name}:${tabs(element.name,descFar)}${element.description}\n`;
            else {
                types.push(element.usage)
                usages[element.usage] = `${message.prefix}${element.name}:${tabs(element.name,descFar)}${element.description}\n`;
            }
        });

        console.log(usages);
        types.forEach(type => {
            type = `${type}`;
            console.log(type.charAt(0).toUpperCase() + type.slice(1) + ' commands: \n' + usages[type]);
            text += `${type.charAt(0).toUpperCase() + type.slice(1)} commands: \`\`\`${usages[type]}\`\`\``;

        })
        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setTitle("Help:")
        .setDescription(text)
        );
    }
}