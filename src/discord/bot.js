async function main(){
    const Discord = require('discord.js')
    const moment = require('moment')
    const recursive = require('recursive-readdir');
    const helper = require('../helper/discordHelper.js')
    const config = require('../config.json')


    const client = new Discord.Client();
    
    const locale = moment.locale('en');
    const uptime = moment().format('LLL');
    
    const prefix = config.prefix
    
    client.commands = new Discord.Collection();

    recursive(__dirname + "/commands/", function(err, files){
        files.forEach(commands => {
            var filesName = commands
            const command = require(filesName)
            client.commands.set(command.name, command);
        });
    })
    
    client.on('ready', async () => {
        helper.uptime(client, uptime)
    });
    
    client.on('message', async message => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;
    
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
    
        let cmdToExecute = client.commands.get(command);
    
        if(cmdToExecute){
            cmdToExecute.execute(client, message, args);
        }
    
    });
    
    client.login(config.token);
}

module.exports = main