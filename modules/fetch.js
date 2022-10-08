import Logger from "cutesy.js"
import get from "../helper/api.js"
import { request, requestOne, insert } from "../helper/database.js"
import { convertToNumber } from "../helper/mods.js"

const logger = new Logger().addTimestamp("hh:mm:ss").blue().changeTag("Fetch")

async function format(score){
    //TODO: Add Accuracy in Advance 2023 : score.accuracy * 100
    return {
        user: score.user_id,
        beatmap: score.beatmap.id,
        scoreid: score.id,
        score: score.score,
        maxcombo: score.max_combo,
        count50: score.statistics.count_50,
        count100: score.statistics.count_100,
        count300: score.statistics.count_300,
        countmiss: score.statistics.count_miss,
        countkatu: score.statistics.count_katu,
        countgeki: score.statistics.count_geki,
        fc: +score.perfect,
        mods: await convertToNumber(score.mods), //TODO: Change in Advance 2023
        time: Math.floor(new Date(score.created_at).getTime() / 1000),
        rank: score.rank,
        pp: score.pp || 0,
        mode: score.mode_int,
        calculated: 0,
        added: Math.floor(new Date().getTime() / 1000)
    }
}

export async function rank(user){
    logger.send(`Fetching ranks for ID: ${user.id}`)
    for(let mode in ["osu", "taiko", "fruits", "mania"]){
        const rank = await requestOne(`
        SELECT * FROM ranks 
        WHERE user = ${user.id} AND mode = ${mode} AND time > ${Math.floor(Date.now() / 1000) - (60 * 60 * 24)}
        `)
        
        if(user.statistics.global_rank == null) return;

        if(!rank){
            await insert("ranks",
            ["user", "global", "country", "pp", "mode", "time"],
            [user.id, user.statistics.global_rank, user.statistics.country_rank, Math.floor(user.statistics.pp), mode, Math.floor(Date.now() / 1000)]
            )
            continue;
        }

        await request(`UPDATE ranks
        SET global = ${user.statistics.global_rank}, country = ${user.statistics.country_rank}, pp = ${Math.floor(user.statistics.pp)}
        WHERE user = ${user.id} AND mode = ${mode} AND time = ${rank.time}
        `)
    }

}

export async function scores(id){
    logger.send(`Fetching scores for ID: ${id}`)
    for(let type of ["best", "recent"]){
        for(let mode of ["osu", "taiko", "fruits", "mania"]){
            const scores = await get(`https://osu.ppy.sh/api/v2/users/${id}/scores/${type}?mode=${mode}&include_fails=1&limit=1000`)

            for(var i = 0; i < scores.length; i++){
                const score = await format(scores[i])
                const keys = Object.keys(score)
                const values = []
    
                for(let j = 0; j < keys.length; j++) {
                    values[j] = score[keys[j]]
                }
    
                const check = await requestOne(`SELECT * FROM scores WHERE scoreid = ${score.scoreid} AND mode = ${score.mode} AND time = ${score.time}`)
                
                if(check) continue;

                await insert("scores", keys , values)
            }
        }
    }
}

export async function user({id, username}){
    let key = id ? "id" : "username"
    let search = id || username

    logger.send(`Fetching user: ${search} (via ${key})`)

    const user = await get(`https://osu.ppy.sh/api/v2/users/${search}/osu?key=${key}`)

    if(user.error === null){
        if(key == "id") return await request(`UPDATE users SET available = 0 WHERE userid = ${id}`)
        return 0;
    }

    const check = await requestOne(`
    SELECT * FROM users
    WHERE ${id ? "userid" : "username_safe"} = "${id ? search : search.toLowerCase().replaceAll(" ", "_")}"
    `)

    if(!check){
        await insert("users", ["userid", "username", "username_safe", "added"],
        [user.id, user.username, user.username.toLowerCase().replaceAll(" ", "_"), Math.floor(Date.now() / 1000)])

        return await ready()
    }

    if(check.username == user.username){
        return await ready()
    }

    await request(`
    UPDATE users SET username = "${user.username}", username_safe = "${user.username.toLowerCase().replaceAll(" ", "_")}"
    WHERE ${id ? "userid" : "username_safe"} = "${id ? search : search.toLowerCase().replaceAll(" ", "_")}"
    `)

    return await ready()

    async function ready(){
        await rank(user)
        await scores(user.id)
    }
}