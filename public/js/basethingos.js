const pool = require("../config/database.js")

async function listing(from,to,bus,train,airplane) {
    try {
        let madeFilterFrom
        let madeFilterTo
        if (from){
            madeFilterFrom = from+"%"
        }else {
            madeFilterFrom ="%"
        }
        if (to){
            madeFilterTo = to+"%"
        }else {
            madeFilterTo = "%"
        }

        let checkbox = "%"
        if (bus === "on" && train === "on" && airplane === "on") {
            let [rows] = await pool.execute('SELECT jarat.azonosito, jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ?', [madeFilterTo, madeFilterFrom, checkbox])
            return rows
        }else if (bus === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT jarat.azonosito, jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"bus","train"])
            return rows
        }else if (airplane === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT jarat.azonosito, jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"airplane","train"])
            return rows
        }else if (bus === "on" && airplane === "on"){
            let [rows] = await pool.execute('SELECT jarat.azonosito, jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilterTo,madeFilterFrom,"bus","airplane"])
            return rows
        }else {
            if (bus === "on"){
                checkbox = "bus"
            }else
            if (train === "on"){
                checkbox = "train"
            }else
            if (airplane === "on"){
                checkbox = "airplane"
            }
            let [rows] = await pool.execute('SELECT jarat.azonosito, jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE celallomas.nev LIKE ? AND induloallomas.nev LIKE ? AND tipus LIKE ?',[madeFilterTo,madeFilterFrom,checkbox])
            return rows
        }

    }catch (err){
        console.log(err)
    }
}

async function ticketBuy(felhasznid){
    try {
        //amiCsakKellösszevonással
        //SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, (jegy.ar*SUM(db)) as ar,SUM(db) as db  FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon  WHERE felhasznaloazonosito = 1698782681496 GROUP BY jegyazonosito;
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, (jegy.ar*SUM(db)) as ar, SUM(db) as db  FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon  WHERE felhasznaloazonosito = ? GROUP BY jegyazonosito ',[felhasznid])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function ticketsOfUser(felhasznid){
    try {
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, SUM(db) as db  FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon  WHERE felhasznaloazonosito = ? GROUP BY jegyazonosito ',[felhasznid])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function userList(){
    try {
        let [rows] = await pool.execute('SELECT * FROM felhasznalo')
        return rows
    }catch (err){
        console.log(err)
    }
}

async function userTicketList(felhasznev){
    //not implemented
    try {
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, SUM(db) as db FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon inner join felhasznalo on felhasznalo_jegyek.felhasznaloazonosito = felhasznalo.id WHERE felhasznalo.nev = ? GROUP BY jegyazonosito',[felhasznev])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function otherTicketList(felhasznev){
    try {
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, db ,felhasznalo_jegyek.azonosito, jegyazonosito FROM felhasznalo_jegyek INNER join jegy on jegyazonosito = jegy.azonosito inner join jarat on jarat.azonosito = jegy.jaratazonosito INNER JOIN allomas as celallomas on celallomas.azonosito = jarat.celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon inner join felhasznalo on felhasznalo_jegyek.felhasznaloazonosito = felhasznalo.id WHERE felhasznalo.nev = ?',[felhasznev])
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

async function jaratTicketGet(jaratazon,jegyazon){
    try {
        let [rows] = await pool.execute('SELECT jaratazonosito, jegy.azonosito as jegyazon, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus, jegy.ar, jegy.elerheto_db FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito WHERE jarat.azonosito IN (SELECT jaratazonosito FROM jegy WHERE jaratazonosito = ?) AND jegy.azonosito = ?',[jaratazon,jegyazon])
        return rows
    }catch (err){
        console.log(err)
    }
}

async function addUserTicket(jegyazon, felhasznid, darb) {
    try {
        await pool.execute('INSERT INTO `felhasznalo_jegyek` (`azonosito`, `jegyazonosito`, `felhasznaloazonosito`, `db`) VALUES (NULL, ?, ?, ?)',[jegyazon,felhasznid,darb])
        await pool.execute('UPDATE `jegy` SET `elerheto_db` = elerheto_db-?  WHERE `jegy`.`azonosito` = ?',[darb,jegyazon])
    }catch (err){
        console.log(err)
    }

}
async function removeUserTicket(azon,darab,jegyazon) {
    try {
        await pool.execute('UPDATE `jegy` SET `elerheto_db` = elerheto_db+?  WHERE azonosito = ?', [darab, jegyazon])
        await pool.execute('delete from felhasznalo_jegyek where azonosito = ?',[azon])

    } catch (err) {
        console.log(err)
    }

}

async function removeFlight(azon) {
    try {
        await pool.execute('delete from jarat where azonosito = ?',[azon])

    } catch (err) {
        console.log(err)
    }

}

async function addStation(nev,varos) {
    try {
        await pool.execute('INSERT INTO allomas (`azonosito`,nev,varos) VALUES (NULL, ?, ?)',[nev.trim(),varos.trim()])
    } catch (err) {
        console.log(err)
    }

}

async function removeStation(nev,varos) {
    try {
        await pool.execute('INSERT INTO allomas (`azonosito`,nev,varos) VALUES (NULL, ?, ?)',[nev,varos])
    } catch (err) {
        console.log(err)
    }

}

async function addFlight(datum,idopont,tipus,iallomaz,callomaz) {
    try {
        await pool.execute('INSERT INTO jarat(`azonosito`,datum,idopont,tipus,induloallomasazon,celallomasazon) VALUES (NULL, ?, ?, ?, ?, ?)',[datum.trim(),idopont,tipus.trim(),iallomaz.trim(),callomaz.trim()])
    } catch (err) {
        console.log(err)
    }

}

async function listFlight() {
    try {
        let [rows] = await pool.execute('SELECT jarat.azonosito, datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon ')
        return rows;
    } catch (err) {
        console.log(err)
    }

}

async function listStation() {
    try {
        let [rows] = await pool.execute('select * from allomas')
        return rows;
    } catch (err) {
        console.log(err)
    }

}

async function addTicket(ar,jaratazon,elerheto_db) {
    try {
        await pool.execute('INSERT INTO jegy(azonosito,ar,jaratazonosito,elerheto_db) VALUES (NULL, ?, ?, ?)',[ar.trim(),jaratazon,elerheto_db])
    } catch (err) {
        console.log(err)
    }

}

async function bestSellingTicketToRide() {
    try {
        let [rows] = await pool.execute('SELECT datum, idopont, celallomas.nev as hova, induloallomas.nev as honnan,tipus, SUM(db) AS eladott FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon INNER JOIN jegy ON jegy.jaratazonosito = jarat.azonosito INNER JOIN felhasznalo_jegyek ON jegy.azonosito = jegyazonosito GROUP BY jarat.azonosito ORDER BY eladott DESC LIMIT 5')
        return rows
    } catch (err) {
        console.log(err)
    }

}
async function promotingUs() {
    try {
        await pool.execute('')
    } catch (err) {
        console.log(err)
    }

}



module.exports ={
    listing,
    jaratGet,
    ticketsOfUser,
    addUserTicket,
    userList,
    otherTicketList,
    removeUserTicket,
    listFlight,
    listStation,
    removeFlight,
    addFlight,
    addStation,
    addTicket,
    jaratTicketGet,
    bestSellingTicketToRide
}
