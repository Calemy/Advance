import mysql from "mysql-await"
import { database } from "../config.js"

let con;

export async function connect(){
    con = mysql.createConnection({
        host: database.host,
        user: database.username,
        password: database.password,
        database: database.db
    })
}

export async function request(query){
    return await con.awaitQuery(query)
}

export async function requestOne(query){
    return (await con.awaitQuery(query))[0]
}

export async function insert(table, fields, values){
    let str = "";

    for(var i = 0; i < values.length; i++){
        if(typeof(values[i]) == 'string'){
            str += `"${values[i]}"`
        } else {
            str += values[i]
        }

        if(i < (values.length -1)){
            str += ", "
        } 
    }

    return await con.awaitQuery(`INSERT INTO ${table} (${fields.join(', ')}) VALUES (${str})`)
}