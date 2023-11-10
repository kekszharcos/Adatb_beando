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
const basething = require('./public/js/basethingos')
const {listing} = require("./public/js/basethingos");

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
        }else {
            res.render("register",{uzi:"Fill it out!"})
        }

    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})

let listas = []


app.post("/admin",  (req, res) => {
    res.render("userprof.ejs", { nev: req.user.nev + " you are in admin mode", szerep: req.user.szerep, lista: listas });
});

app.post("/listing", (req, res) => {
    listing(req.body.myInput,req.body.busz,req.body.vonat,req.body.repulo).then(rows =>res.render("index",{lista:rows}))
        .then(r => console.log(req.body))

});

//Útvonal

app.get("/", (req, res)=>{
    res.render("index.ejs",{lista:listas})
})
app.get("/login", auth.checkNotAuthenticated,(req,res)=>{
    res.render("login.ejs",{success:""})
})
app.get("/register", auth.checkNotAuthenticated, (req,res)=>{
    res.render("register.ejs")
})
app.get("/userprof", auth.checkAuthenticated ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev +", you logged in", szerep: req.user.szerep, lista: ""})
})
app.get("/admin", auth.checkAuthenticated,auth.checkAdminPermission ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev, szerep: req.user.szerep, lista: listas})
})

//utvonalak vege

app.delete("/logout", (req,res)=>{
    req.logOut(req.user, err=>{
        if (err) return next(err)
        res.render("login",{error:"You logged out!",success:""})
    })


})

app.listen(3000)