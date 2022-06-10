const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const petSchema = new Schema({
    
    name:{
        type: String,
        required: true
    },
    type:{
        type: String,
        required: true
    },
    breed:{
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    }
    
})

const Pet = mongoose.model('Pet', petSchema);
module.exports = Pet;