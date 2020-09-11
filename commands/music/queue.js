module.exports = {
    name: 'queue',
    usage: 'music',
    description: "Ez egy queue :3!",
    execute(message, args, server) {
        const Discord = require('discord.js');
        var pages = [], pageCtn = 0;
        var i = 0;

        pages.push({
            lineCtn: 0,
            lineFirst: 1,
            text: ''
        });
        if (server.datas.forEach(info => {
            if (pages[pageCtn].lineCtn < 20 && pages[pageCtn].text.length < 1940) {
                pages[pageCtn].text += '**' + ++i + '**.: **[' + info.title + '](' + info.url + ')' + ((i==1) ? ' -> \[now playing\]' : '') + '**\n';
                pages[pageCtn].lineCtn++;
            }
            else {
                pages.push({
                    lineCtn: 0,
                    lineFirst: i+1,
                    text: '**' + ++i + '**.: **[' + info.title + '](' + info.url + ')' + ((i==1) ? ' -> \[now playing\]' : '') + '**\n'
                });
                pageCtn++;
            }
        })) {
            pages[0].text = "No songs to show.";
        }


        pages.forEach(page => {
            console.log(page.text);
            console.log(page.text.length);
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setTitle(`Queue(${page.lineFirst}-${page.lineFirst+page.lineCtn-1}):`)
            .setDescription(page.text));
        })

    }
}