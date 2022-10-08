import fetch from "node-fetch"
import { username, password } from "../config.js"

const cache = []

async function login(){
    let c = cache[0]

    if(!c) return await generate()
    cache.length = 0

    if(c.expires_in < Math.floor(Date.now() / 1000)) return await generate()

    if(c.reset < Math.floor(Date.now() / 1000)){
        c.reset = Math.floor(Date.now() / 1000) + 60
        c.count = 0
    } else {
        if(c.count >= 1000){
            return setTimeout(async () => await login(), c.reset - Math.floor(Date.now() / 1000) + 1)
        }
        c.count++
    }

    cache.push(c)
    return c.access_token
}

async function generate(){
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
    };

    const body = {
        "username": username,
        "password": password,
        "client_id": 5,
        "client_secret": "FGc9GAtyHzeQDshWP5Ah7dega8hJACAJpQtw6OXk",
        "grant_type": "password",
        "scope": "*"
    }

    let token;

    try {
        const response = await fetch("https://osu.ppy.sh/oauth/token", {
            method: "POST",
            headers,
            body: JSON.stringify(body),
        })
    
        token = await response.json()
    } catch (e){
        return await generate()
    }

    token.count = 1
    token.reset = Math.floor(Date.now() / 1000) + 60
    token.expires_in = Math.floor(Date.now() / 1000) + token.expires_in

    cache.push(token)
    return token.access_token
}

export default async function get(url) {
    const key = await login()
    try {
        const request = await fetch(url, {
            headers: {
                "authorization": "Bearer " + key,
                "scope": "*",
                "user-agent": "osu-lazer"
            },
        })

        if(request.url.includes(".osz")) return request

        const data = await request.json()

        return data
    } catch(e){
        return await get(url)
    }
}