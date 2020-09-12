module.exports = {
    name: 'queue',
    usage: 'music',
    description: "Ez egy queue :3!",
    execute(message, args, server) {
        const Discord = require('discord.js');
        var pages = [], pageCtn = 0, linePerPage = 15;
        var i = 0;

        pages.push({
            lineCtn: 0,
            lineFirst: 1,
            text: ''
        });
        try { 
            server.datas.forEach(info => {
            if (pages[pageCtn].lineCtn < linePerPage && pages[pageCtn].text.length < 1940) {
                pages[pageCtn].text += '\n**' + ++i + '**.: **[' + info.title + '](' + info.url + ')' + ((i==1) ? ' -> \[now playing\]' : '') + '**';
                pages[pageCtn].lineCtn++;
            }
            else {
                pages.push({
                    lineCtn: 0,
                    lineFirst: i+1,
                    text: '\n**' + ++i + '**.: **[' + info.title + '](' + info.url + ')' + ((i==1) ? ' -> \[now playing\]' : '') + '**'
                });
                pageCtn++;
            }
        })
        }
        catch {
            pages[0].text = "No songs to show.";
        }

        function listQueue(pageNum, msg, moveBack = false, moveForward = false) {
            const pageNumO = pageNum;
            if (moveBack) pageNum = pageNum - 1;
            if (moveForward) pageNum = pageNum + 1;
            if (!(pageNum < 0 || pageNum > pageCtn)) {
                var page = pages[pageNum];
                console.log(page.text);
                console.log(page.text.length);
                msg.edit(new Discord.MessageEmbed()
                .setColor('#d497e9')
                .setTitle(`Queue(${page.lineFirst}-${page.lineFirst+page.lineCtn-1}:${i}):`)
                .setDescription(page.text)).then((msg) => {
                    if (pageCtn > 0) {
                        //console.log(msg);
                        msg.react('◀️');
                        msg.react('▶️');
                        msg.awaitReactions((reaction, user) => { return ['◀️', '▶️'].includes(reaction.emoji.name) && user.id === message.author.id; }, { max:1, time: 600000, errors: ['time'] }).then(collected => {
                            const reaction = collected.first();
                            //console.log(reaction.emoji.name);
                            if (reaction.emoji.name === '◀️') {
                                msg.edit(listQueue(pageNum, msg, true, false));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                            else if (reaction.emoji.name === '▶️') {
                                msg.edit(listQueue(pageNum, msg, false, true));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                        }).catch(err => console.log(err));
                    }
                });
            }
            else {
                msg.edit(listQueue(pageNumO, msg));
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            }
        }
        
        //pages.forEach(page => {
            message.channel.send(new Discord.MessageEmbed()
            .setColor('#d497e9')
            .setTitle(`Queue():`)
            .setDescription(pages[0].text)).then((msg) => {
                if (server) listQueue(0, msg);
            });
        //});
    }
}