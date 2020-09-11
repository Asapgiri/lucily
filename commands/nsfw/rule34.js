module.exports = {
    name: 'rule34',
    usage: 'nsfw',
    description: "Send a random nsfv searched pic!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        const gsearch = require('image-search-google');
        const search = new gsearch(process.env.google_search_engine, process.env.googleyt_api_token);
        
        async function getPic() {
        var url;
        await search.search(`rule34 ${args.join(' ')}`, {page: Math.floor(Math.random() * 100) })
        .then(images => {
            //console.log(images);
            url = images[Math.floor(Math.random() * 10)].url;
            console.log(`get: rule34 ${args.join(' ')} - ${url}`);
            message.channel.send(new Discord.MessageEmbed()
            .setColor(Math.floor(Math.random()*16777215).toString(16))
            .setTitle('Lő rule34!')
            .setImage(url)
            );
        }).catch(error => message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setImage('https://media1.tenor.com/images/7b25f540db61fa86ed3677835a5ca304/tenor.gif?itemid=14855710')
        .setTitle('No picture found.. so sorry.')));
        }
        getPic();
    }
}