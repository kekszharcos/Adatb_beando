const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")


function initialize(passport, getUserByEmail, getUserById){
    //authenticate
    const authenticateUsers = async (email,jelszo,done ) => {
        const user = getUserByEmail(email)
        if (user == null){
            //atirni egysegre
            return done(null,false,{message: "No user found by email!"})
        }
        try {
          if (await bcrypt.compare(jelszo,user.jelszo)){
            return done(null,user)
          }else{
              //atirni egysegre
              return done(null,false, {message: "Incorrect password"})
          }
        } catch (e) {
            console.log(e)
            return done(e)
        }
    }

    passport.use(new LocalStrategy({usernameField:'email'},authenticateUsers))
    passport.serializeUser((user,done)=>done(null, user.id))
    passport.deserializeUser((id,done)=>{
        return done(null, getUserById(id))
    })
}
module.exports = initialize