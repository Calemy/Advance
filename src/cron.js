async function main(){
    const cron = require('node-cron')
    const osu = require('./helper/dataHelper.js')
    const global = require('./helper/globHelper.js')
    const database = require('./helper/dbHelper.js');
    
    console.log("Cron scheduled")
    
    cron.schedule('0 0 * * * *', async () => {
        console.log("Updating Database...")
        const users = await database.request(`SELECT * FROM users`)

        let pos = 0;

        while(pos < users.length){
            const user = users[pos]

            const data = {
                id: user.userid,
                username: user.username
            }
            
            await osu.recent(data)
            await global.delay(1000)
            pos++
        }

    })



}


module.exports = main;
