const passport= require('passport')
const LocalStrategy=require('passport-local').Strategy;

const User=require('../models/User')

passport.use(new LocalStrategy({
    usernameField:'email'
}, async (email, password, done)=>{
    const user=await User.findOne({email: email})
    if(!user){
        return done(null, false,{message:'not user found'})//usuario no encotrado
    }else{
        const match=await user.matchPassword(password)
        if(match){
            return done(null, user);
        }else{
            return done(null, false, {message:'incorrect password'})
        }
    }

}));//2:51 validacion de rutas

passport.serializeUser((user,done)=>{
    done(null, user.id)//se guarda la session para evitar ingresar el login a cada rato
})

passport.deserializeUser((id,done)=>{//si ay un usuario en la seion se busca el id del usuario
    User.findById(id,(err,user)=>{
        done(err, user);
    })
})
