import { user } from "../modules/fetch.js"
import { request } from "../helper/database.js"
export default async function(){
    async function update(){
        const users = await request(`SELECT * FROM users`)

        for(var i = 0; i < users.length; i++){
            await user({id: users[i].userid})
        }
    }

    update()

    setInterval(async () => {
        await update()
    }, 1000 * 60 * 60)
}