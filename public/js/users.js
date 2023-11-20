const pool = require("../config/database");

let users = []
async function loginUsers(){
    try {
        let login_sql = 'SELECT * FROM felhasznalo'
        let [rows] = await pool.execute(login_sql)
        return rows
    }catch (err){
        console.log(err)
    }

}
loginUsers().then(rows =>users=rows)

async function updateUsersData(){
    try {
        loginUsers().then(rows =>users=rows)
    }catch (err){
        console.log(err)
    }

}

async function addUser(user) {
    // Felhasználó hozzáadása a tömbhöz
    try {
        let sql = 'INSERT INTO `felhasznalo` (`id`, `nev`, `email`, `jelszo`, `szerep`) VALUES (?, ?, ?, ?, ?)'
        let [rows] = await pool.execute(sql,[user.id,user.nev,user.email,user.jelszo,user.szerep])
        loginUsers().then(rows =>users=rows)
            .catch(err => console.log(err))
    }catch (err){
        console.log(err)
    }

}

async function findByEmailP(email) {
    // Felhasználó keresése az email alapján
    try {
        let sql = 'SELECT * FROM felhasznalo where email = ?'
        let [rows] = await pool.execute(sql,[email])
        return rows
    }catch (err){
        console.log(err)
    }
}
function findByEmail(email) {
    // Felhasználó keresése az email alapján
    return users.find(user => user.email === email);
}

function findByName(nev) {
    // Felhasználó keresése az email alapján
    return users.find(user => user.nev === nev);
}

/*async function findById(id) {
    // Felhasználó keresése az id alapján
    try {
        let sql = 'SELECT * FROM felhasznalo where id = ?'
        let [rows] = await pool.execute(sql,[id])
        return rows
    }catch (err){
        console.log(err)
    }
}*/
function findById(id) {
    // Felhasználó keresése az id alapján
    return users.find(user => user.id === id);
}
function  isEmailOccupied (email){
    return users.some(felhasznalo => felhasznalo.email === email);
}

module.exports = {
    addUser,
    findByEmail,
    findById,
    findByName,
    isEmailOccupied,
    updateUsersData
};