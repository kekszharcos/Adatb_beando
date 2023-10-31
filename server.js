if (process.env.NODE_ENV !== "production"){
    require("dotenv").config()
}

//npmmel letöltve
const express = require("express")
const app = express()
const bcrypt = require("bcrypt")
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const path = require("path");
const favicon = require('serve-favicon');
const method_override = require("method-override")
const pool = require("./database.js")


let users = []
let felhasznaloksql = 'SELECT * FROM felhasznalo'
pool.execute(felhasznaloksql,function (err,res){
    if (err) throw err
    res.forEach(kek=>{
        users.push(kek)

    })
    console.log(users)
})

initializePassport(
    passport,
    email=> users.find(felhasznalo => felhasznalo.email === email),
    id => users.find(felhasznalo => felhasznalo.id === id)
)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: false}))
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
app.post("/login", checkNotAuthenticated,passport.authenticate("local",{
    successRedirect: "/userprof",
    failureRedirect: "/login",
    failureFlash: true
}))
//Register post config
app.post("/register",checkNotAuthenticated ,async (req,res,done)=>{
    try {
        const hashed_password = await bcrypt.hash(req.body.password, 10)
        if (!users.find(felhasznalo => felhasznalo.email === req.body.email)){
            users.push({
                id: Date.now().toString(),
                nev: req.body.username,
                email: req.body.email,
                jelszo: hashed_password,
                szerep: "user"
            })
            let adando = users.find(felhasznalo => felhasznalo.email === req.body.email)
            let felhasznaloksql = 'INSERT INTO felhasznalo (id, nev, email, jelszo, szerep) VALUES (' +
                "'" + adando.id + "', '" + adando.nev + "', '" + adando.email + "', '" + adando.jelszo + "', '" + adando.szerep + "');";
            pool.execute(felhasznaloksql)
            res.redirect("/login")
        }else {
           let uzi = "Az email már foglalt."
        }

        console.log(users)

    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})
//Útvonal
app.get("/", (req, res)=>{
    res.render("index.ejs")
})
app.get("/login", checkNotAuthenticated,(req,res)=>{
    res.render("login.ejs")
})
app.get("/register", checkNotAuthenticated, (req,res)=>{
    const isEmailOccupied = users.some(felhasznalo => felhasznalo.email === req.body.email);
    if (isEmailOccupied){
        res.render("register.ejs", { uzi: "Az email már foglalt." });
    }
    res.render("register.ejs" )
})
app.get("/userprof", checkAuthenticated ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev})
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname,'public','sources','favico.ico')))
//utvonalak vege

app.delete("/logout", (req,res)=>{
    req.logOut(req.user, err=>{
        if (err) return next(err)
        res.redirect("/login")
    })


})
function checkAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req,res,next){
    if(req.isAuthenticated()){
       return res.redirect("/userprof")
    }
    next()
}


app.listen(3000)