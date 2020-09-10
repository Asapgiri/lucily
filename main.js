const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '~';
const fs = require('fs');
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    console.log('message: ~' + command.name + ' found.');
    client.commands.set(command.name, command);
}

var servers = {};


client.once('ready', () => {
    client.user.setActivity('~Meghaltál! :)', {
        type: 'LISTENING'
    });
    console.log('Bot is active!');
});

client.on('message', message => {
    if (message.content == 'meghaltál') { message.channel.send('Meghaltál.'); return; }
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();

    
    try {
        switch (command) {
            //play music ---------------------------------
            case 'p':
            case 'play':
                client.commands.get('play').execute(message, args, servers);
                break;
        
            //skip music -------------------------------------
            case 's':
            case 'skip':
                client.commands.get('skip').execute(message, args, servers);
                break;

            //end music playing ---------------------------------
            case 'd':
            case 'die':
            case 'stop':
                client.commands.get('stop').execute(message, args, servers);
                break;

            case 'h':
            case 'help':
                client.commands.get('help').execute(message, client.commands.array());
                break;

            case 'q':
            case 'queue':
                client.commands.get('queue').execute(message, args, servers[message.guild.id]);
                console.log(servers[message.guild.id].datas);
                break;

            default:
                if (message.member.roles.cache.has('720273044035076116') || message.member.hasPermission("ADMINISTRATOR")) {
                    if (message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has('720273044035076116')) message.channel.send('Lő with admin perm!');
                    client.commands.get(command).execute(message, args);
                }
        }
    } catch (e) {
        console.log('ERROR: ' + e.message);
        message.channel.send('Hiba!');
        client.commands.get('bazdmegh').execute(message, args);
    }

});

client.login('NzUyOTQyMTMwOTI1Nzk3NTI4.X1e-AQ.h2msB_1khZpJKq50tYi8Id0h0hE');