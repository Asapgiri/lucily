module.exports = {
    name: 'nhentai',
    usage: 'nsfw',
    description: "Send a random nhentai manga!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const json = require('get-json');
        var noyaoi = false, random = false;
        var pages = [], pageCtn = 0, linePerPage = 25, ini = 0;

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

            function getTheFcknJsonAll(pp = 1) {
            json(`https://nhentai.net/api/galleries/search?query=${(!args[0]) ? 'anal%20astolfo' : (!args[1]) ? args[0] : args.join('%20')}&page=${pp}`, (err, data) => {
                if (err) console.log(err);
                //console.log(data);
                data.result.forEach((hentai) => {
                    try { 
                        //server.datas.forEach((info, i) => {
                        if (pages[pageCtn].lineCtn < linePerPage && pages[pageCtn].text.length < 1940) {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages[pageCtn].text += `\n**${++ini} -[${hentai.title.pretty}](https://nhentai.net/g/${hentai.id})**`
                                pages[pageCtn].lineCtn++;
                            }
                        }
                        else {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages.push({
                                    lineCtn: 0,
                                    lineFirst: ++ini,
                                    text: `\n**${ini} -[${hentai.title.pretty}](https://nhentai.net/g/${hentai.id})**`
                                });
                            
                                pageCtn++;
                            }
                        }
                        
                    //})
                    }
                    catch (e) {
                        pages[0].text = "No hentai to show.";
                        console.log(e);
                    }
                    
                    
                    });
                    //console.log(pageCtn);
                
                    if (pp < data.num_pages) getTheFcknJsonAll(pp+1);
                    if (pp === 1) {
                        function listQueue(pageNum, msg, moveBack = false, moveForward = false) {
                            const pageNumO = pageNum;
                            if (moveBack) pageNum = pageNum - 1;
                            if (moveForward) pageNum = pageNum + 1;
                            if (!(pageNum < 0 || pageNum > pageCtn)) {
                                var page = pages[pageNum];
                                //console.log(page.text);
                                //console.log(page.text.length);
                                msg.edit(new Discord.MessageEmbed()
                                .setColor('#d497e9')
                                .setTitle(`Entries(${page.lineFirst}-${page.lineFirst+page.lineCtn}:${pages[pages.length-1].lineFirst+pages[pages.length-1].lineCtn+1}):`)
                                .setDescription(page.text)).then((msg) => {
                                    if (pageCtn > 0) {
                                        //console.log(msg);
                                        if (pageNum !== 0) {
                                            if (pageNum !== 1) msg.react('⏪');
                                            msg.react('◀️');
                                        }
                                        if (pageNum !== pages.length-1) {
                                            msg.react('▶️');
                                            if (pageNum !== pages.length-2) msg.react('⏩');
                                        }
                                        msg.awaitReactions((reaction, user) => { return ['◀️', '▶️', '⏪', '⏩'].includes(reaction.emoji.name) && user.id === message.author.id; }, { max:1, time: 600000, errors: ['time'] }).then(collected => {
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
                                            else if (reaction.emoji.name === '⏪') {
                                                msg.edit(listQueue(0, msg));
                                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                                            }
                                            else if (reaction.emoji.name === '⏩') {
                                                msg.edit(listQueue(pageCtn, msg));
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
                        
                            message.channel.send(new Discord.MessageEmbed()
                            .setColor('#282550')
                            .setTitle('Found entris.')
                            .setDescription(pages[0].text)).then((msg) => {
                                listQueue(0, msg);
                            });
                    }
                })
                
            }
            getTheFcknJsonAll();

        
    }
}
}