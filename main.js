const Discord = require('discord.js');
const client = new Discord.Client();
const prefix = '~';
const fs = require('fs');
var path = require('path');
const chalk = require('chalk');
client.commands = new Discord.Collection();

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(function(file) {
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

walk('commands', function(err, results) {
    if (err) throw err;
    //console.log(results.filter(file => file.endsWith('.js')));
    results.filter(file => file.endsWith('.js')).forEach(file => {
        const command = require(file);
        console.log('message: ' + prefix + command.name + ' - ' + command.usage + chalk.green(' found.   ') + file);
        client.commands.set(command.name, command);
    })
});

var servers = {};


client.once('ready', () => {
    client.user.setActivity(prefix + 'Meghaltál! :)', {
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
                message.listQueue = client.commands.get('queue');
                client.commands.get('play').execute(message, args, servers);
                break;

            case 'r':
            case 'radio':
                message.listQueue = client.commands.get('queue');
                message.play = client.commands.get('play');
                client.commands.get('radio').execute(message, args, servers);
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
                message.prefix = prefix;
                client.commands.get('help').execute(message, client.commands.array());
                break;

            case 'q':
            case 'queue':
                client.commands.get('queue').execute(message, args, servers[message.guild.id]);
                //console.log(servers[message.guild.id].datas);
                break;

            case 'gt':
                client.commands.get('gt').execute(message, args, servers);
                break;

            default:
                //if (message.member.roles.cache.has('720273044035076116') || message.member.hasPermission("ADMINISTRATOR")) {
                    //if (message.member.hasPermission("ADMINISTRATOR") && !message.member.roles.cache.has('720273044035076116')) message.channel.send('Lő with admin perm!');
                    client.commands.get(command).execute(message, args);
                //}
        }
    } catch (e) {
        console.log('ERROR: ' + e);
        message.channel.send(new Discord.MessageEmbed()
        .setColor('#d497e9')
        .setImage('https://media1.tenor.com/images/7b25f540db61fa86ed3677835a5ca304/tenor.gif?itemid=14855710')
        .setTitle('Some error occured...'))
        //client.commands.get('bazdmegh').execute(message, args);
    }

});

client.login(process.env.token);