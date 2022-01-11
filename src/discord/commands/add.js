module.exports = {
    name: 'track',
    description: "lmfao pepega api Edition",
    async execute(client, message, args){
        const osu = require('../../helper/dataHelper.js');
        const database = require('../../helper/dbHelper.js');
        const Discord = require('discord.js')

        if(!args[0]) return message.channel.send("You need to specify a user!")
        const input = args[0];
        
        const user = await osu.user(input);
    
        if(!user) return message.channel.send("User not found");
    
        const request = await database.request(`SELECT * FROM users WHERE username = '${user.username}'`);
        if(request.length > 0) return message.channel.send("User already exists!");

        con.query(`INSERT INTO users (userid, username, username_safe, added) VALUES ('${user.id}', '${user.username}', '${user.username.toLowerCase().replaceAll(' ', '_')}', '${Math.round(Date.now()/1000)}')`, function (err){
            if(err) throw err;
        })

        const embed = new Discord.MessageEmbed()
        embed.setImage(`https://a.ppy.sh/${user.id}`)
        embed.setTitle(`Saving ${user.username}'s data!`)
        embed.setDescription(`You are getting added into the database.\nYour scores will be scanned daily.`)
        embed.setTimestamp()
        embed.setFooter(`Thank you for using advance!`)

	message.channel.send(embed);

        await osu.best(user)
        await osu.recent(user)

    }
}