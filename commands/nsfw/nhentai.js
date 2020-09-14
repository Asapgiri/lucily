module.exports = {
    name: 'nhentai',
    usage: 'nsfw',
    description: "Send a random nhentai manga!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const json = require('get-json');
        var noyaoi = false, random = false;
        var pages = [], pageCtn = 0, linePerPage = 15;

        pages.push({
            lineCtn: 0,
            lineFirst: 1,
            text: ''
        });

        if (!isNaN(args[0])) {
            var index = args[0];
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
                    try { 
                        server.datas.forEach((info, i) => {
                        if (pages[pageCtn].lineCtn < linePerPage && pages[pageCtn].text.length < 1940) {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages[pageCtn].text += `\n**${i+1} -[${hentai.title.pretty}](https://nhentai.net/g/${hentai.id})**`
                            }
                            pages[pageCtn].lineCtn++;
                        }
                        else {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages.push({
                                    lineCtn: 0,
                                    lineFirst: i+1,
                                    text: `\n**${i+1} -[${hentai.title.pretty}](https://nhentai.net/g/${hentai.id})**`
                                });
                            
                                pageCtn++;
                            }
                        }
                    })
                    }
                    catch {
                        pages[0].text = "No songs to show.";
                    }
                    
                    
                });
                
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
                message.channel.send(new Discord.MessageEmbed()
                .setColor('#282550')
                .setTitle('Found entris.')
                .setDescription(text));
            })
        } 
    }
}