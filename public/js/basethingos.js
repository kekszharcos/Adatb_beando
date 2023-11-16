const pool = require("../config/database.js")

async function listing(from,to,bus,train,airplane) {
    try {
        let madeFilterFrom = "%"+from+"%"
        let madeFilterTo = "%"+to+"%"
        let checkbox = "%"
        if (bus === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"bus","train"])
            return rows
        }else if (airplane === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"airplane","train"])
            return rows
        }else if (bus === "on" && airplane === "on"){
            let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"bus","airplane"])
            return rows
        }else if (bus === "on" && train === "on" && airplane === "on") {
            let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ?',[madeFilterTo,madeFilterFrom,checkbox])
            return rows
        } else {
            if (bus === "on"){
                checkbox = "bus"
            }else
            if (train === "on"){
                checkbox = "train"
            }else
            if (airplane === "on"){
                checkbox = "airplane"
            }
            let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ?',[madeFilterTo,madeFilterFrom,checkbox])
            return rows
        }

    }catch (err){
        console.log(err)
    }
}

async function tickets(felhasznid){
    try {
        //amiCsakKellösszevonással
        //SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, (jegy.ar*SUM(db)) as ar,SUM(db) as db  FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon  WHERE felhasznaloazonosito = 1698782681496 GROUP BY jegyazonosito;
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, (jegy.ar*SUM(db)) as ar, SUM(db) as db  FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon  WHERE felhasznaloazonosito = ? GROUP BY jegyazonosito ',[felhasznid])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function userList(){
    //nincskesz
    try {
        let [rows] = await pool.execute('SELECT * FROM felhasznalo')
        return rows
    }catch (err){
        console.log(err)
    }
}

async function userTicketList(){
    //nincskesz
    try {
        let [rows] = await pool.execute('SELECT * FROM felhasznalo INNER JOIN felhasznalo_jegyek on felhasznalo.id = felhasznalo_jegyek.felhasznaloazonosito')
        return rows
    }catch (err){
        console.log(err)
    }
}

async function jaratGet(id){
    try {
        let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE jarat.azonosito = ?',[id])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function addTicket(jegyazon,felhasznid,darb){
    try {
        await pool.execute('INSERT INTO `felhasznalo_jegyek` (`azonosito`, `jegyazonosito`, `felhasznaloazonosito`, `db`) VALUES (NULL, ?, ?, ?)',[jegyazon,felhasznid,darb])
        await pool.execute('UPDATE `jegy` SET `elerheto_db` = elerheto_db-?  WHERE `jegy`.`azonosito` = ?',[darb,jegyazon])
    }catch (err){
        console.log(err)
    }
}


module.exports ={
    listing,
    jaratGet,
    tickets,
    addTicket,
    userList
}
