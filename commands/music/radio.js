const getJson = require('get-json');

module.exports = {
    name: 'radio',
    usage: 'music',
    description: "Ez egy rádió :3!",
    execute(message, args, servers) {
        const Discord = require('discord.js');
        const json = require('get-json');
        var server = servers[message.guild.id];
        const pageN = 0 //Math.floor(Math.random() * 3);
        const plN = Math.floor(Math.random() * 50);
        var pageCtn = 0;
        
        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setDescription(`Started searching for radio..`))
        .then(msg => {
            msg.delete({ timeout: 7000 })
        });
        
        message.play('playlist?list=' + getPlId());
        
        function getPlId(nextToken) {
            json(`https://www.googleapis.com/youtube/v3/search?q=music${(args[0]) ? '+' + args.join('+') : ''}&maxResults=50&key=${process.env.googleyt_api_token}&type=playlist${(nextToken) ? '&pageToken=' + nextToken: ''}`, (err, data) => {
                //console.log(data);    
                console.log(`Getting page: ${pageCtn} : ${data.nextPageToken} : ${pageN} - ${plN}`)
                if (pageCtn < pageN) {
                    pageCtn++;
                    return getPlId(data.nextPageToken);
                }
                else {
                    return data.items[plN].id.playlistId;
                }
            });
        }
    }
}