const mysql = require('mysql2')


const pool = mysql.createPool({
    host: 'localhost',
    user: 'tesztelo',
    password: 'tesztelo',
    database: 'helyfoglalas'
})

module.exports = pool




