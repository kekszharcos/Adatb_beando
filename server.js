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

users=[]
initializePassport(
    passport,
    email=> users.find(user => user.email === email),
    id => users.find(user => user.id === id)
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


app.post("/login", passport.authenticate("local",{
    successRedirect: "/userprof",
    failureRedirect: "/login",
    failureFlash: true
}))
//Register post config
app.post("/register", async (req,res)=>{
    try {

        const hashed_password = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(),
            name: req.body.username,
            email: req.body.email,
            password: hashed_password
        })
        console.log(users)
        res.redirect("/login")
    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})
//Útvonal
app.get("/", (req, res)=>{
    res.render("index.ejs")
})
app.get("/login", (req,res)=>{
    res.render("login.ejs")
})
app.get("/register", (req,res)=>{
    res.render("register.ejs")
})
app.get("/userprof", (req,res)=>{
    res.render("userprof.ejs",{name: req.user.name})
})
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname,'public','sources','favico.ico')))





app.listen(3000)