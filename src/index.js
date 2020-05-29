const express = require('express');
const path=require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override');
const session= require('express-session');
const flash=require('connect-flash');
const passport=require('passport')

//inicializaciones 
const app= express();
require('./database') // inicializa la base de datos desde el archivo js
require('./config/passport')
//setting
app.set('port', process.env.PORT || 3000); //cuando lo pones en un servicio en la nube se usa el procvess
app.set('views',path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout:'main',
    layoutsDir:path.join(app.get('views'),'layouts'), //carpeta layout
    partialsDir:path.join(app.get('views'),'partials'), //parpeta partials
    extname: '.hbs'
}));//motor de plantilla .hbs
app.set('view engine','.hbs');

//midleware
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'));//permite enviar otros metodos como delete y put
app.use(session({
    secret:'mysecretapp',
    resave: true,
    saveUninitialized:true
})); //perm,ite autenticar el usuario temporalmente
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//global variables
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next(); // termina el proceso o sino cargara indefinidamente
})
//routes
app.use(require('./routes/index')) // saber que estaos son las rutas del servidos
app.use(require('./routes/notes'))
app.use(require('./routes/users'))
//static files

app.use(express.static(path.join(__dirname,'public')))

//server is listnig
app.listen(app.get('port'),()=>{
    console.log('server en puerto', app.get('port'))
})