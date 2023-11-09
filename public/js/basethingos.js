const pool = require("../config/database.js")

async function listing(input,bus,train,airplane) {
    try {
        let madeFilter = "%"+input+"%"
        let checkbox = "%"
        if (bus === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT datum,idopont, celallomas.nev as honnan, induloallomas.nev as hova, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon WHERE celallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilter,"bus","train"])
            return rows
        }else if (airplane === "on" && train === "on"){
            let [rows] = await pool.execute('SELECT datum,idopont, celallomas.nev as honnan, induloallomas.nev as hova, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon WHERE celallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilter,"airplane","train"])
            return rows
        }else if (bus === "on" && airplane === "on"){
            let [rows] = await pool.execute('SELECT datum,idopont, celallomas.nev as honnan, induloallomas.nev as hova, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon WHERE celallomas.nev LIKE ? AND tipus LIKE ? OR tipus LIKE ?',[madeFilter,"bus","airplane"])
            return rows
        }else if (bus === "on" && train === "on" && airplane === "on") {
            let [rows] = await pool.execute('SELECT datum,idopont, celallomas.nev as honnan, induloallomas.nev as hova, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon WHERE celallomas.nev LIKE ? AND tipus LIKE ?',[madeFilter,checkbox])
            return rows
        } else {
            if (bus === "on"){
                checkbox = "bus"
            }
            if (train === "on"){
                checkbox = "train"
            }
            if (airplane === "on"){
                checkbox = "airplane"
            }
            let [rows] = await pool.execute('SELECT datum,idopont, celallomas.nev as honnan, induloallomas.nev as hova, tipus FROM jarat INNER JOIN allomas as celallomas on celallomas.azonosito = celallomasazon INNER JOIN allomas as induloallomas ON induloallomas.azonosito = jarat.induloallomasazon WHERE celallomas.nev LIKE ? AND tipus LIKE ?',[madeFilter,checkbox])
            return rows
        }

    }catch (err){
        console.log(err)
    }
}


module.exports ={
    listing
}
