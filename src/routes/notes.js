const express = require('express');
const router = express.Router();

const Note=require('../models/Note')

router.get('/notes/add',(req,res)=>{ //cuando el usuario entra en la ruta
    res.render('notes/new-note');
})
//async es un proceso asincrono
router.post('/notes/new-note' ,async (req,res)=>{// recepcion del formulario del new-note.hbs
    console.log(req.body)
    const {title, description}=req.body // se obtiene los objetos del envio del formulario y lo espcifica json
    const errors=[]
    if(!title){ // si no hay un titulo
        errors.push({text:'porfavor escriba un titulo'})//con el push el text se anvia al formulario
    }
    if(!description){ // si no hay una descripcion
        errors.push({text:'porfavor escriba una descripcion'})
    }
    if(errors.length>0){//si no hay errores detectados
        res.render('notes/new-note',{ //muestra los campos que se inserto mal
            errors,
            title,
            description
        })
    }else{
        const newNote=new Note({title, description})
        //res.send('ok formulario aceptado')
        
        console.log('ok formulario aceptado')
        console.log(newNote)
        await newNote.save(); // se guarda los datos en mongo //await cuando se termine este proceso asincrono se procede el codigo debajo
        req.flash('success_msg', 'note added successful')
        res.redirect('/notes') //redireccion
        //res.send('ok')
    }
    //res.send('ok ya llego el formulario al server') //cuando el mensaje llega al servidor
})

router.get('/notes/edit')

router.get('/notes', async(req,res)=>{ // es un proceso asincrono
    //res.send('notas desde base de datos');
    const notes=await Note.find().sort({date:'desc'}); //llama desde la base de datos // lo odena de arriba asta abajo
    res.render('notes/all-notes', {notes})
})

router.get('/notes/edit/:id', async (req,res)=>{
    const note=await Note.findById(req.params.id);// esta agarando el id
    res.render('notes/edit-note',{note})// se envia el dato note al html
})

router.put('/notes/edit-note/:id', async (req,res)=>{//valores ocultos para recibir valores put
    const {title, description}=req.body;
    await Note.findByIdAndUpdate(req.params.id, {title, description})
    req.flash('success_msg','nota actualizada')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', async (req,res)=>{
    console.log(req.params.id)
    await Note.findByIdAndDelete(req.params.id)
    req.flash('success_msg','note deleted successfully')
    res.redirect('/notes')
})
module.exports=router;
//apartir 2:03:31 del video se explica el sistema multiusuario