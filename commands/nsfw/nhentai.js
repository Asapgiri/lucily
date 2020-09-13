module.exports = {
    name: 'nhentai',
    usage: 'nsfw',
    description: "Send a random nhentai manga!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const json = require('get-json');
        var noyaoi = false, random = false;

        var index;
        if (!isNaN(args[0])) {
            index = args[0];
            message.reply(`https://nhentai.net/g/${index}`);
        } else {
            text = '';
            if (args.includes('noyaoi')) {
                args.splice(args.indexOf('noyaoi'), 1);
                noyaoi = true;
            }
            if (args.includes('random')) {
                args.splice(args.indexOf('random'), 1);
                random = true;
            }
            if (args.includes('english')) args.splice(args.indexOf('english'), 1);

            json(`https://nhentai.net/api/galleries/search?query=${(!args[0]) ? 'anal%20astolfo' : (!args[1]) ? args[0] : args.join('%20')}`, (err, data) => {
                if (err) throw err;
                //console.log(data.result);
                data.result.forEach((hentai, i) => {
                    if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                        //console.log(hentai);
                        text += `\n**${i+1} -[${hentai.title.pretty}](https://nhentai.net/g/${hentai.id})**`
                    }
                });
                message.channel.send(new Discord.MessageEmbed()
                .setColor('#282550')
                .setTitle('Found entris.')
                .setDescription(text));
            })
        } 
    }
}