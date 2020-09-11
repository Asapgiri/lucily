module.exports = {
    name: 'slap',
    usage: 'gif',
    description: "Ez egy pofozás :3!",
    execute(message, args, servers = null) {
        //console.log('Sending gif..');
        const Discord = require('discord.js');
        const gsearch = require('image-search-google');
        const search = new gsearch(process.env.google_search_engine, process.env.googleyt_api_token);
        
        async function getPic() {
        var url;
        await search.search('anime slap gif', {page: Math.floor(Math.random() * 100) })
        .then(images => {
            url = images[Math.floor(Math.random() * 10)].url;
        }).catch(error => console.log(error));
        //console.log(url);

        /*var random = Math.floor(Math.random() * require('fs').readdirSync('slap').filter(pic => pic.endsWith('.gif')).length)
        const path = 'slap/' + random + '.gif';
        const gif = random + '.gif';
        var text;*/
        //console.log(message.guild.members);

        if (!args[0]) {
            var members = message.guild.members;
            var sum = 0;
            members.cache.forEach(item => { sum++; });
            var random = Math.floor(Math.random() * sum);
            sum=0;
            var memb;
            members.cache.forEach(item => { if (sum++ == random) memb=item; });

            //console.log(memb);
            //console.log(`${memb} - ${members} - ${sum}`);
            text = message.author.toString() + ' felpofozza: ' + 
            memb.toString() + ' -t. :\'3'
        } else if (message.mentions.users.first() && message.guild.member(message.mentions.users.first()).id == message.author.id) {
            text = message.author.toString() + ' felpofozza saját magát. :\'3'
        } else {
            text = message.author.toString() + ' felpofozza: ' + args[0] + ' -t. :3'
        }
        console.log(`${text} - ${url}`);

        //console.log('Sending slap gif..');
        message.channel.send(new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setTitle('Lő slap!')
        .setDescription(text)
        //.attachFiles(new Discord.MessageAttachment(path, gif))
        .setImage(url)  //.setImage('attachment://' + gif)
        );
        }
        getPic();
    }
}