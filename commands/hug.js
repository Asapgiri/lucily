module.exports = {
    name: 'hug',
    description: "Ez egy ölelés :3!",
    execute(message, args, servers = null) {
        console.log('Sending gif..');
        const Discord = require('discord.js');
        const gsearch = require('image-search-google');
        const search = new gsearch('8d317a98238da0996', 'AIzaSyBrNXND0o93shYR3jmNaDMe7DtxOspkDNY');
        
        async function getPic() {
        var url;
        await search.search('anime hug gif', {page: Math.floor(Math.random() * 300) })
        .then(images => {
            url = images[Math.floor(Math.random() * 10)].url;
        }).catch(error => console.log(error));
        console.log(url);

        /*var random = Math.floor(Math.random() * require('fs').readdirSync('hug').filter(pic => pic.endsWith('.gif')).length)
        const path = 'hug/' + random + '.gif';
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

            console.log(memb);
            console.log(`${memb} - ${members} - ${sum}`);
            text = message.author.toString() + ' megöleli: ' + 
            memb.toString() + ' -t. :\'3'
        } else if (message.guild.member(message.mentions.users.first()).id == message.author.id) {
            text = message.author.toString() + ' megöleli saját magát. :\'3'
        } else {
            text = message.author.toString() + ' megöleli: ' + args[0] + ' -t. :3'
        }

        console.log('Sending gif..');
        message.channel.send(new Discord.MessageEmbed()
        .setColor(Math.floor(Math.random()*16777215).toString(16))
        .setTitle('Lő hug!')
        .setDescription(text)
        //.attachFiles(new Discord.MessageAttachment(path, gif))
        .setImage(url)  //.setImage('attachment://' + gif)
        );
        }
        getPic();
    }
}