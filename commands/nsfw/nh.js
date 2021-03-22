module.exports = {
    name: 'nh',
    usage: 'nsfw',
    description: "Send a not so random nhentai manga! -Extended content",
    execute(message, args, client) {
        const Discord = require('discord.js');
        const json = require('get-json');
        const cheerio = require('cheerio');
        const Axios = require('axios');

        var noyaoi = false, random = false;
        var pages = [], pageCtn = 0, linePerPage = 25, ini = 0, choosen = false; //search
        var gallery = {
            title: '',
            cover: '',
            tags: '',
            type: '',
            pageCtn: 0,
            pages: []
        };

        pages.push({
            lineFirst: 1,
            text: []
        });

        if (!isNaN(args[0])) {
            var index = args[0];
            //message.reply(`https://nhentai.net/g/${index}`);
            listHfirst(index);
        }
        else if (args[0] == 'spam' && !isNaN(args[1])) {
            var index = args[1];
            //message.reply(` Not yet works... https://nhentai.net/g/${index}`);
            listHfirst(index);
        }
        else {
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

            getTheFcknJsonAll();
        }


        function listQueue(pageNum, msg, moveBack = false, moveForward = false) {
            const pageNumO = pageNum;
            if (moveBack) pageNum = pageNum - 1;
            if (moveForward) pageNum = pageNum + 1;
            if (!(pageNum < 0 || pageNum > pageCtn)) {
                var page = pages[pageNum];
                var text = '';
        
                page.text.forEach(p => {
                    text += '\n' + p.link;
                    //console.log(p);
                });
        
        
                //console.log(text);
                //console.log(page.text.length);
                msg.edit(new Discord.MessageEmbed()
                .setColor('#d497e9')
                .setTitle(`Entries(${page.lineFirst}-${page.lineFirst+page.text.length}:${pages[pages.length-1].lineFirst+pages[pages.length-1].text.length+1}):`)
                .setDescription(text)).then((msg) => {
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
                        msg.awaitReactions((reaction, user) => { return ['◀️', '▶️', '⏪', '⏩'].includes(reaction.emoji.name) && user.id != client.user.id;  }, { max:1, time: 600000, errors: ['time'] }).then(collected => {
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
                        if (!choosen) {
                            choosen = true;
                            msg.channel.awaitMessages(user => user.author.id != client.user.id, {max: 1, time: 600000}).then(collected => {
                                //console.log(collected);
                                //console.log(collected.first().content);
                                var coll = collected.first().content;
                                if (0 < coll < (pages[pageCtn-1].text[pages[pageCtn-1].text.length-1].id)) {
                                    page = Math.floor(coll / linePerPage);
                                    coll = coll % linePerPage;
                                    listHfirst(pages[page].text[coll].id);
                                }
                            }).catch(err => console.log(err));
                        }
                    }
                    else {
                        msg.channel.awaitMessages(user => user.author.id != client.user.id, {max: 1, time: 600000}).then(collected => {
                            //console.log(collected);
                            //console.log(collected.first().content);
                            var coll = collected.first().content;
                            if (0 < coll < pages[0].text.length) {
                                page = Math.floor(coll / linePerPage);
                                coll = coll % linePerPage;

                                listHfirst(pages[page].text[coll].id);
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
        
        function getTheFcknJsonAll(pp = 1) {
            json(`https://nhentai.net/api/galleries/search?query=${(!args[0]) ? 'anal%20astolfo' : (!args[1]) ? args[0] : args.join('%20')}&page=${pp}`, (err, data) => {
                if (err) console.log(err);
                //console.log(data);
                data.result.forEach((hentai) => {
                    try { 
                        //server.datas.forEach((info, i) => {
                        if (pages[pageCtn].text.length < linePerPage) {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages[pageCtn].text.push({ link: `**${++ini} -[${hentai.title.pretty.slice(0, 30)}](https://nhentai.net/g/${hentai.id}) - [${hentai.id}]**`, id: hentai.id, index: ini });
                            }
                        }
                        else {
                            if (!noyaoi || !hentai.tags.some(tag => tag.name === 'yaoi')) {
                                //console.log(hentai);
                                pages.push({
                                    lineFirst: ++ini,
                                    text: [{ link: `\n**${ini} -[${hentai.title.pretty.slice(0, 50)}](https://nhentai.net/g/${hentai.id}) - [${hentai.id}]**`, id: hentai.id, index: ini  }]
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
                    message.channel.send(new Discord.MessageEmbed()
                    .setColor('#282550')
                    .setTitle('Found entris.')
                    .setDescription(pages[0].text)).then((msg) => {
                        listQueue(0, msg);
                    });
                }
            })
                
        }
        
        async function listHfirst(id) {
            const html = await Axios.get(`http://nhentai.net/g/${id}`).then(ret => ret.data).catch(e => {
                if (e.response.status == 404) throw new Error('Doujin Not Found');
                else throw e;
            });
            const $ = cheerio.load(html);

            gallery.title = `[${$('#info .title').text()}](https://nhentai.net/g/${id})`;
            gallery.cover = $('#cover').text().split('"')[1].split('"')[0];
            gallery.pageCtn = $('.thumb-container').text().split('>').length -1;
            gallery.type = gallery.cover.split('.')[3];
            gallery.tags = $('.tag-container').text().split(':')[3].split('\n')[1].replace(/[\t0123456789]/g, '').split('K').filter(x => x != '').join(' - ');

            var g_id = gallery.cover.split('/')[4];

            for (var i = 1; i <= gallery.pageCtn; i++) {
                gallery.pages.push(`https://i.nhentai.net/galleries/${g_id}/${i}.${gallery.type}`);
            }

            //console.log(gallery);

            message.channel.send(new Discord.MessageEmbed()
                    .setColor('#d497e9')
                    .setTitle(gallery.title)
                    .setThumbnail(gallery.cover)
                    .setImage(gallery.pages[0])
                    .addField('Tags', gallery.tags, true)
                    .setDescription(`Loading [...]`)).then((msg) => {
                        listH(0, msg);
                    });
        }
        
        function listH(pageNum, msg, moveBack = false, moveForward = false) {
            //console.log('listH CALLED');
            const pageNumO = pageNum;
            if (moveBack) pageNum = pageNum - 1;
            if (moveForward) pageNum = pageNum + 1;
            if (!(pageNum < 0 || pageNum > gallery.pageCtn)) {
                msg.edit(new Discord.MessageEmbed()
                .setColor('#d497e9')
                .setTitle(gallery.title)
                .setThumbnail(gallery.cover)
                .setImage(gallery.pages[pageNum])
                .addField('Tags', gallery.tags, true)
                .setDescription(`Page ${pageNum+1} out of ${gallery.pageCtn}:`)).then((msg) => {
                    if (gallery.pageCtn > 0) {
                        //console.log(msg);
                        if (pageNum !== 0) {
                            if (pageNum !== 1) msg.react('⏪');
                            msg.react('◀️');
                        }
                        if (pageNum !== gallery.pages.length-1) {
                            msg.react('▶️');
                            if (pageNum !== gallery.pages.length-2) msg.react('⏩');
                        }
                        msg.awaitReactions((reaction, user) => { return ['◀️', '▶️', '⏪', '⏩'].includes(reaction.emoji.name) && user.id != client.user.id;  }, { max:1, time: 600000, errors: ['time'] }).then(collected => {
                            const reaction = collected.first();
                            //console.log(reaction.emoji.name);
                            if (reaction.emoji.name === '◀️') {
                                msg.edit(listH(pageNum, msg, true, false));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                            else if (reaction.emoji.name === '▶️') {
                                msg.edit(listH(pageNum, msg, false, true));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                            else if (reaction.emoji.name === '⏪') {
                                msg.edit(listH(0, msg));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                            else if (reaction.emoji.name === '⏩') {
                                msg.edit(listH(gallery.pageCtn-1, msg));
                                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
                            }
                        }).catch(err => console.log(err));
                    }
                });
            }
            else {
                msg.edit(listH(pageNumO, msg));
                msg.reactions.removeAll().catch(error => console.error('Failed to clear reactions: ', error));
            }
        }
    }
}

/*
function parseDetails(html) {
    console.log(html.find());
    console.log();
    console.log();
    let json = /(?<=gallery\()\{.+\}(?=\);)/.exec(html)[0];
    
    console.log(json);
    console.log();
    console.log();

    let obj = JSON.parse(json);
    
    console.log(obj);
    console.log();
    console.log();

	// For consistency such as https://nhentai.net/g/66/
	if (typeof obj.id == 'string') obj.id = parseInt(obj.id);
	return obj;
}*/