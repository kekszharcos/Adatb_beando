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
const method_override = require("method-override")
const pool = require("./database.js")
const validator = require("email-validator");


let users = []
function updateUsers () {
    let login_sql = 'SELECT * FROM felhasznalo'
    pool.execute(login_sql,function (err,res){
        if (err) console.log(err)
        res.forEach(kek=>{
            users.push(kek)
        })
        console.log(users)
    })
}
updateUsers()

initializePassport(
    passport,
    email=> users.find(felhasznalo => felhasznalo.email === email),
    id => users.find(felhasznalo => felhasznalo.id === id)
)
app.use(express.static('public'))
app.use("/css",express.static(path.join(__dirname, 'public/css')))
app.use("/js",express.static(path.join(__dirname, 'public/js')))
app.use("/sources",express.static(path.join(__dirname, 'public/sources')))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs')
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
        let uzi = []
        if (!users.find(felhasznalo => felhasznalo.email === req.body.email) && req.body.password === req.body.password_again && validator.validate(req.body.email) && req.body.username !== ""){
            const hashed_password = await bcrypt.hash(req.body.password, 10)
            users.push({
                id: Date.now().toString(),
                nev: req.body.username,
                email: req.body.email,
                jelszo: hashed_password,
                szerep: "user"
            })
            let adando = users.find(felhasznalo => felhasznalo.email === req.body.email)
            let felhasznalo_hozzaadas_sql = 'INSERT INTO felhasznalo (id, nev, email, jelszo, szerep) VALUES (' +
                "'" + adando.id + "', '" + adando.nev + "', '" + adando.email + "', '" + adando.jelszo + "', '" + adando.szerep + "');";
            pool.execute(felhasznalo_hozzaadas_sql)
            res.redirect("/login")

        }else if (users.find(felhasznalo => felhasznalo.email === req.body.email) && req.body.password === req.body.password_again && validator.validate(req.body.email) && req.body.username !== ""){
            uzi.push("This email is occupied!")
            res.render("register.ejs",{uzi:uzi})
        }else if (req.body.password !== req.body.password_again){
            uzi.push("Passwords must match!")
            res.render("register.ejs",{uzi:uzi})
        }else {
            res.redirect("/register")
        }
        //

        console.log(users)

    } catch (e) {
        console.log(e)
        res.redirect("/register")
    }
})

let listas = [];
pool.execute('SELECT allomas.nev, datum, idopont, tipus FROM jarat INNER JOIN allomas ON allomas.azonosito = jarat.celallomasazon',function (err,res){
    if (err) console.log(err)
    res.forEach(kek=>{
        listas.push(kek)
    })
});
app.post("/admin",  (req, res) => {
    res.render("userprof.ejs", { nev: req.user.nev + " you are in admin mode", szerep: req.user.szerep, lista: listas });
});

//Útvonal
app.get("/", (req, res)=>{
    /*function myFunction() {
        const pool = require('./database.js')
        let myInput, filter, ul, li, a, i, txtValue;
        let lista = []
        myInput = document.getElementById('myInput')
        filter = "'%"+myInput.value()+"%'"
        console.log(filter)
        pool.execute('SELECT allomas.nev, datum, idopont, tipus FROM jarat INNER JOIN allomas ON allomas.azonosito = jarat.celallomasazon WHERE nev LIKE '+filter,function (err,res){
            if (err) console.log(err)
            res.forEach(kek=>{
                lista.push(kek)
            })
        });
        ul = document.getElementById("myUl");
        li = ul.getElementsByTagName('li');

        // Loop through all list items, and hide those who don't match the search query
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("a")[0];
            txtValue = a.textContent || a.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }

    }*/
    res.render("index.ejs",{lista:listas})
})
app.get("/login", checkNotAuthenticated,(req,res)=>{
    res.render("login.ejs")
})
app.get("/register", checkNotAuthenticated, (req,res)=>{
    const isEmailOccupied = users.some(felhasznalo => felhasznalo.email === req.body.email);
    if (isEmailOccupied){
        res.render("register.ejs");
    }
    res.render("register.ejs");

})
app.get("/userprof", checkAuthenticated ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev, szerep: req.user.szerep, lista: ""})
})
app.get("/admin", checkAuthenticated,checkAdminPermission ,(req,res)=>{
    res.render("userprof.ejs",{nev: req.user.nev, szerep: req.user.szerep, lista: listas})
})

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

function checkAdminPermission(req,res,next){
    if(req !== "admin"){
        return res.redirect("/userprof")
    }
    next()
}

app.listen(3000)