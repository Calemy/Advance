module.exports = {
    name: 'card',
    description: 'showes advance card',
    async execute(client, message, args){
        const Discord = require('discord.js')
        const database = require('../../helper/dbHelper.js')
        const image = require('../../helper/imageHelper.js')

        if(!args[0]) return message.channel.send("Please provide a user!")
        const input = args[0];
        const request = await database.request(`SELECT * FROM users WHERE username_safe = '${input.toLowerCase()}'`);
        if(request.length < 1) return message.channel.send("That user is not in our database!");
        const user = request[0];
        const mode = 0;
        
        //TODO: add support for other modes

        const embed = new Discord.MessageEmbed()
        embed.setTitle(`${user.username}'s Standard profile`)

        const [scores, most, best] = await Promise.all([
                database.request(`SELECT mods FROM scores WHERE user = '${user.userid}' AND mode = '${mode}' AND time > '1640991599'`),
                database.request(`SELECT *, COUNT('beatmap') as beatmapcount FROM scores WHERE user = '${user.userid}' AND mode = '${mode}'AND time > '1640991599' GROUP BY beatmap HAVING beatmapcount > 0 ORDER BY beatmapcount DESC LIMIT 5`),
                database.request(`SELECT pp FROM scores WHERE user = '${user.userid}' AND mode = '${mode}' AND time > '1640991600' ORDER BY pp DESC LIMIT 5`)
        ]);

        const favsongs = [];
        
        let pos = 0;

        while(pos < most.legnth){
            const mbmrq = await fetch(`https://kitsu.moe/api/meta?b=${most[pos].beatmap}`)
            const mbeatmap = await mbmrq.json()
            favsongs.push(mbeatmap.title)
            pos++;
        }

        const favmod = await calculator.favmods(scores)

        const data = {
            user: user.username,
            id: user.userid,
            pp: [
                best[0].pp,
                best[1].pp,
                best[2].pp,
                best[3].pp,
                best[4].pp
            ],
            mod: favmod,
            songs: favsongs
        }

        await image.wrapped(data)

        const file = new Discord.MessageAttachment(`/var/www/html/beta/${stats.id}.png`);
        message.channel.send(`${user.username}'s osu!wrapped`, file);

    }
}
