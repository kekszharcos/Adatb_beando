const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { findByEmail, findById} = require('./users');

function authenticateUser(email, password, done) {
    try {
        let user = findByEmail(email)
        if (user == null) return done(null, false, { message: 'Invalid email or password' });
        // user változó tartalmazza az adatbázisból lekért felhasználói adatokat
        if (bcrypt.compare(password, user.jelszo)) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Invalid email or password' });
        }
    }catch (err){
        console.log(err)
    }

}

function initializePassport() {
    // Passport beállítása
    passport.use(new LocalStrategy({ usernameField: 'email' }, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => done(null, findById(id)));
}

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
    if(req.user.szerep !== "admin"){
        return res.redirect("/userprof")
    }
    next()
}

module.exports = {
    initializePassport,
    checkAdminPermission,
    checkNotAuthenticated,
    checkAuthenticated
    // Egyéb funkciók...
};