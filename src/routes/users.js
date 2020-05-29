const express = require('express');
const router = express.Router();

const User=require('../models/User')

const passport=require('passport');

router.get('/users/signin',(req,res)=>{
    res.render('users/signin');
})

router.post('/users/signin',passport.authenticate('local',{
    successRedirect:'/notes',
    failureRedirect:'/users/signin',
    failureFlash:true
}))

router.get('/users/signup',(req,res)=>{
    res.render('users/signup');
})
router.post('/users/signup',async (req,res)=>{
    //console.log(req.body)
    const {name,email,password, confirm_password}=req.body;
    const errors=[];
    //console.log(name.length)
    if(name.length<=0){
        errors.push({text:'please insert your name'})// porfavor inserte tu normbre
    }

    if(password!=confirm_password){
        errors.push({text:'password do not match'})//las contraseñas no coinciden
    }
    if(password.length<4){
        errors.push({text:'password must be at least 4 characters'})// la contraseña debe de ser de almenos 4 caracteres
    }
    if(errors.length>0){
        res.render('users/signup', {errors,name,email,password, confirm_password})
    }else{
        const emailUser=await User.findOne({email:email})//validar si no hay otro correo igual
        if (emailUser){
            req.flash('error_msg', 'the email is already in use')//el email ya esta en uso
            res.redirect('/users/signup')
        }
        const newUser=new User({name,email,password})
        newUser.password=await newUser.encryptPassword(password)
        await newUser.save()
        req.flash('success_msg','you are registered')//tu estas registrado
        res.redirect('/users/signin')
        //2:30:00 logeo de usuario
    }
    //res.send('ok')
})
module.exports=router;