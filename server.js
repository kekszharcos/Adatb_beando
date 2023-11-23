if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

//npmmel letöltve
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const flash = require("express-flash")
const session = require("express-session")
const path = require("path");
const method_override = require("method-override")
const validator = require("email-validator");
const auth = require('./public/js/auth');
const users = require('./public/js/users');
const querys = require("./public/js/basethingos");
const {userList} = require("./public/js/basethingos");

// Egyéb modulok importálása...

// Közös middleware-ek és beállítások
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use("/config",express.static(path.join(__dirname, 'public/config')))
app.use("/css",express.static(path.join(__dirname, 'public/css')))
app.use("/js",express.static(path.join(__dirname, 'public/js')))
app.use("/sources",express.static(path.join(__dirname, 'public/sources')))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(method_override("_method"))

//Login post config

auth.initializePassport(
    passport,
    email => users.findByEmail(email),
    id => users.findById(id)
);
app.post("/login", auth.checkNotAuthenticated, passport.authenticate("local",{
    successRedirect: "/userprof",
    failureRedirect: "/login",
    failureFlash: true
}))
//Register post config
app.post("/register",auth.checkNotAuthenticated ,async (req,res,done)=>{
    try {
        let uzi = []
        if (!await users.findByEmail(req.body.email) &&!users.findByName(req.body.username) && req.body.password === req.body.password_again && validator.validate(req.body.email) && req.body.username !== ""){
            const hashed_password = await bcrypt.hash(req.body.password, 10)
            await users.addUser({
                id: Date.now().toString(),
                nev: req.body.username,
                email: req.body.email,
                jelszo: hashed_password,
                szerep: "user"
            })
            res.render("login",{success:"You successfully registered."})

        }else if (users.isEmailOccupied(req.body.email) && req.body.password === req.body.password_again && validator.validate(req.body.email) && req.body.username !== ""){
            uzi.push("This email is occupied!")
            res.render("register.ejs",{uzi:uzi})
        }else if (req.body.password !== req.body.password_again){
            uzi.push("Passwords must match!")
            res.render("register.ejs",{uzi:uzi})
        }else if (users.findByName(req.body.username)){
            res.render("register",{uzi:"Username already in use!"})
        }else if (!validator.validate(req.body.email)) {
            res.render("register",{uzi:"Bad email address format(do not use Diacritic characters)"})
        }else {
            res.render("register",{uzi:"Fill it out!"})
        }

    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})

let listas = []

app.post("/listing",auth.checkNotAuthenticated, (req, res) => {
    querys.listing(req.body.from,req.body.to,req.body.bus,req.body.train,req.body.airplane).then(rows =>{

        if (rows.length === 0){
            querys.bestSellingTicketToRide().then(sork =>res.render("index",{lista:rows,sork, uzi:"No public transport found"}))
        }else {
            querys.bestSellingTicketToRide().then(sork =>res.render("index",{lista:rows,sork}))
        }

    })
});

app.post("/flightlisting", auth.checkAuthenticated, (req,res)=>{
    querys.listing(req.body.from,req.body.to,req.body.bus,req.body.train,req.body.airplane).then(rows =>{
        if (rows.length === 0){
            querys.bestSellingTicketToRide().then(sork =>res.render("loggedInListing.ejs",{lista:rows, sork, szerep:req.user.szerep,ticketbuyview:"no", uzi:"No public transport found"}))
        }else{
            querys.bestSellingTicketToRide().then(sork =>res.render("loggedInListing.ejs",{lista:rows, sork, szerep:req.user.szerep,ticketbuyview:"no"}))
        }

    })
})

app.post("/ticketBuy:id",auth.checkAuthenticated,(req,res)=>{
    splitter = req.params.id.split('Am')
    querys.jaratTicketGet(splitter[0],splitter[1]).then(rows=>{
        let vetelszam
        if (req.body.number > rows[0].elerheto_db){
            vetelszam = rows[0].elerheto_db
        }else {
            vetelszam = req.body.number
        }
        res.render("loggedInListing",{szerep:req.user.szerep, ticketbuyview:"yes", rows, szam: vetelszam})
    })

})
app.post("/boughtATicket:jaratjegy",auth.checkAuthenticated,(req,res)=>{
    let splitter = req.params.jaratjegy.split("To")
    querys.addUserTicket(splitter[1],req.user.id,splitter[2]).then(r=>{
        querys.ticketsOfUser(req.user.id).then(rows=>res.render("mytickets.ejs",{uzi:"You just bought a ticket!", szerep: req.user.szerep, lista: rows}))
    })
})

app.post("/ticketsOf:nev", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    querys.otherTicketList(req.params.nev).then(rows => res.render("mytickets.ejs",{szerep: req.user.szerep, otherUserView: "on", guy: req.params.nev, lista: rows}))
})
app.post("/removeTicket:azonosito", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    splitter = req.params.azonosito.split("T")
    let azonosito = splitter[0]
    let nev = splitter[1]
    let jegyazonosito = splitter[2]
    let darab = splitter[3]

    querys.removeUserTicket(azonosito,darab,jegyazonosito).then(rows =>  querys.otherTicketList(nev).then(rows => res.render("mytickets.ejs",{szerep: req.user.szerep, otherUserView: "on", guy: nev, lista: rows, uzi:"Ticket removed successfully!"})))
})
app.post("/addFlight", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    let datum = req.body.datum.split("-")
    let jodatum
    if (req.body.datum === ''){
        jodatum = "0001-01-01"
        datum = jodatum.split("-")
    }else if (parseInt(datum[0]) > 9999){
        jodatum = "9999"
        jodatum+="-"+datum[1]+"-"+datum[2]
    }else {
        jodatum = req.body.datum
    }
    if (parseInt(datum[0]) < 2023){
        jodatum = "2023"
        jodatum+="-"+datum[1]+"-"+datum[2]
    }

    querys.addFlight(jodatum,req.body.idopont,req.body.tipus,req.body.source,req.body.destination).then(rows =>{
        querys.listStation().then(rows=>querys.listFlight().then(sork =>res.render("flightModerate.ejs",{szerep: req.user.szerep, lista: rows,flightLista:sork, uzi:"Flight added succsessfully!"})))
    })
})

app.post("/addStation", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    querys.addStation(req.body.nev,req.body.varos).then(rows =>{
        querys.listStation().then(rows=>querys.listFlight().then(sork =>res.render("flightModerate.ejs",{szerep: req.user.szerep, lista: rows,flightLista:sork, uzi:"Station added succsessfully!"})))
    })
})
app.post("/addTicket", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    querys.addTicket(req.body.ar,req.body.jaratazon,req.body.elerheto).then(rows =>{
        querys.listStation().then(rows=>querys.listFlight().then(sork =>res.render("flightModerate.ejs",{szerep: req.user.szerep, lista: rows, flightLista:sork, uzi:"Ticket added succsessfully!"})))
    })
})
app.post("/removeFlight", auth.checkAuthenticated, auth.checkAdminPermission,(req,res)=>{
    querys.removeFlight(req.body.removable).then(rows =>{
        querys.listStation().then(rows=>querys.listFlight().then(sork =>res.render("flightModerate.ejs",{szerep: req.user.szerep, lista: rows,flightLista:sork, uzi:"Flight removed succsessfully!"})))
    })
})


//Útvonal

app.get("/",auth.checkNotAuthenticated, (req, res)=>{
    ////werewrwerw
    querys.listing(req.body.from,req.body.to,req.body.bus,req.body.train,req.body.airplane).then(rows =>{
        querys.bestSellingTicketToRide().then(sork =>res.render("index.ejs",{lista:rows,sork}))
    });
})
app.get("/login", auth.checkNotAuthenticated,(req,res)=>{
    users.updateUsersData().then(r => {
        res.render("login.ejs", {success: ""})
    })
})
app.get("/register", auth.checkNotAuthenticated, (req,res)=>{
    res.render("register.ejs")
})
app.get("/userprof", auth.checkAuthenticated ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev +", you logged in",email: req.user.email, szerep: req.user.szerep, lista: ""})
})
app.get("/tickets", auth.checkAuthenticated ,(req,res)=>{
    querys.ticketsOfUser(req.user.id).then(rows=>res.render("mytickets.ejs",{ szerep: req.user.szerep, lista: rows}))
})
app.get("/publicTransportList", auth.checkAuthenticated ,(req, res)=>{
    //////erterter
    querys.listing(req.body.from,req.body.to,req.body.bus,req.body.train,req.body.airplane).then(rows =>{

        if (rows.length === 0){
            querys.bestSellingTicketToRide().then(sork =>res.render("loggedInListing.ejs",{lista:rows, sork, szerep:req.user.szerep,ticketbuyview:"no", uzi:"No public transport found"}))
        }else {
            querys.bestSellingTicketToRide().then(sork =>res.render("loggedInListing.ejs",{lista:rows, sork, szerep:req.user.szerep,ticketbuyview:"no"}))
        }

    })
})
app.get("/users", auth.checkAuthenticated, auth.checkAdminPermission ,(req,res)=>{
    userList().then(rows=>{
        res.render("users.ejs",{szerep: req.user.szerep, lista: rows})
    })
})
app.get("/flightModerate", auth.checkAuthenticated, auth.checkAdminPermission ,(req,res)=>{
   querys.listStation().then(rows=>querys.listFlight().then(sork =>res.render("flightModerate.ejs",{szerep: req.user.szerep, lista: rows,flightLista:sork})))
})

//utvonalak vege

app.delete("/logout", (req,res)=>{
    req.logOut(req.user, err=>{
        if (err) return next(err)
        res.render("login",{success:"You logged out!"})
    })


})

app.listen(3000)