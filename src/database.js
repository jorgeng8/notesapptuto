const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex:true,
    useNewUrlParser:true,
    useFindAndModify:false
})
    .then(db=>console.log('db is connect (la base de datos se a conectado con exito)'))
    .catch(err=>console.log(err))
