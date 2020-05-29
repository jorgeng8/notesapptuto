const mongoose = require('mongoose');
const {Schema }= mongoose
 // esuqmea de datos
const NoteSchema= new Schema({
    title:{type:String, required:true},
    description:{type:String, required:true},
    date:{type:Date, default:Date.now} // si no tiene fecha le da la fecha actual
})

module.exports = mongoose.model('Note', NoteSchema)