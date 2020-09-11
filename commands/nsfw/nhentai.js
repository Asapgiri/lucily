module.exports = {
    name: 'nhentai',
    usage: 'nsfw',
    description: "Send a random nhentai manga!",
    execute(message, args, servers = null) {
        const Discord = require('discord.js');
        var index;
        if (!isNaN(args[0])) {
            index = args[0];
            message.reply(`https://nhentai.net/g/${index}`);
        } else {
            const gsearch = require('image-search-google');
            const search = new gsearch(process.env.google_search_engine, process.env.googleyt_api_token);
            
            search.search(`nhentai ${args.join(' ')}`, {page: Math.floor(Math.random() * 100)})
            .then(images => {

                var image = Math.floor(Math.random() * 10);
                message.reply(`**${images[image].snippet} ->** ${images[image].context}`);
            }).catch(error => console.log(error));
        } 
    }
}