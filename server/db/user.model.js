import { query } from './db.js'

class User {
    constructor({username, password, id}) {
        this.id = id
        this.username = username
        this.password = password
    }
}

async function getUser(username) {
    const [results, fields] = await query(`SELECT * FROM users WHERE username='${username}'`)
    if (results.length > 0) {
        return new User(results[0])
    }
    return
}

async function createUser(username, password) {
    const [results, fields] = await query(`INSERT INTO users (username, password) VALUES ('${username}', '${password}')`)
    return
}

export {
    getUser, createUser
}