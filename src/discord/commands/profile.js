module.exports = {
    name: 'profile',
    description: 'showes advance profile',
    async execute(client, message, args){
        const Discord = require('discord.js')
        const database = require('../../helper/dbHelper.js')
        const osu = require('../../helper/dataHelper.js')
        const calculator = require(`../../helper/calcHelper.js`)
        const fetch = require('node-fetch')
        const moment = require('moment')

        moment.locale('en-gb')

        if(!args[0]) return message.channel.send("Please provide a user!")
        const input = args[0];
        const request = await database.request(`SELECT * FROM users WHERE username_safe = '${input.toLowerCase()}'`);
        if(request.length < 1) return message.channel.send("That user is not in our database!");
        const user = request[0];
        const mode = 0;
        //TODO: add support for other modes
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${user.username}'s Standard profile`)

	const userdata = {
		id : user.userid,
		username : user.username
	}

        await osu.rank(userdata)


        //! Promise all for SPEEEED

        const scores = await database.request(`SELECT * FROM scores WHERE user = '${user.userid}' AND mode = '${mode}'`);
        const most = await database.request(`SELECT *, COUNT('beatmap') as beatmapcount FROM scores WHERE user = '${user.userid}' AND mode = '${mode}' GROUP BY beatmap HAVING beatmapcount > 0 ORDER BY beatmapcount DESC`);
        const best = await database.request(`SELECT * FROM scores WHERE user = '${user.userid}' AND mode = '${mode}' ORDER BY pp DESC LIMIT 1`);
        const recent = await database.request(`SELECT * FROM scores WHERE user = '${user.userid}' AND mode = '${mode}' ORDER BY time DESC LIMIT 1`);
        const rank = await database.request(`SELECT global, country FROM ranks WHERE user = '${user.userid}' AND mode = '${mode} ORDER BY rank DESC LIMIT 1'`);
        
        const mbmrq = await fetch(`https://kitsu.moe/api/meta?b=${most[0].beatmap}`)
        const mbeatmap = await mbmrq.json()

        const bbmrq = await fetch(`https://kitsu.moe/api/meta?b=${best[0].beatmap}`)
        const bbeatmap = await bbmrq.json()

        const rbmrq = await fetch(`https://kitsu.moe/api/meta?b=${recent[0].beatmap}`)
        const rbeatmap = await rbmrq.json()


        let yearly = 0;
        let monthly = 0;
        let daily = 0;
        let totalpp = 0;

        for(var i = 0; i < scores.length; i++){
            if(scores[i].time > 1640991599){
                yearly++;
                if(scores[i].rank != "F"){
                    totalpp += scores[i].pp
                }
            }
            if(scores[i].time > Math.round(Date.now() / 1000 - 86400 * 30)) monthly++;
            if(scores[i].time > Math.round(Date.now() / 1000 - 86400)) daily++;
        }

        const favmod = await calculator.favmods(scores)


        embed.addField(`Scores in 2022:`, yearly)
        embed.addField(`Scores in past month:`, monthly)
        embed.addField(`Scores in past 24h:`, daily)
        embed.addField(`Raw Performance Played:`, `${Math.round(totalpp)}pp`)
        embed.addField(`Recorded Highest Rank: `, rank[0].global)
        embed.addField(`Favourite Beatmap:`, `${mbeatmap.artist} - ${mbeatmap.title} (${most[0].beatmapcount} Times)`)
        embed.addField(`Favourite Mod: `, `${favmod.mod} (${favmod.count} times)`)
        embed.addField(`Best Performance:`, `${Math.round(best[0].pp)}pp on ${bbeatmap.artist} - ${bbeatmap.title}`)
        embed.addField(`Last Played:`, `${rbeatmap.artist} - ${rbeatmap.title} (${moment((parseInt(recent[0].time) + 3600) * 1000).fromNow()})`)
        embed.setTimestamp()
        embed.setFooter(`Thank you for using advance!`)
        embed.setThumbnail(`https://a.ppy.sh/${user.userid}`)

        message.channel.send(embed);
    }
}
