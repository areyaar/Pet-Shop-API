const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Pets = require('./models/pets');
const xlsx = require('xlsx');

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/pets', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN")
    })
    .catch(err => {
        console.log("MONGO CONNECTION ERROR")
        console.log(err)
    })

app.use(express.urlencoded({ extended: true }));

var sheet = xlsx.readFile('data.xlsx'); //got the file
var wb = sheet.Sheets['Sheet1']; //got the sheet
var data = xlsx.utils.sheet_to_json(wb); // sheet data in JSON

//Getting all the pets from the database
app.get('/api/pet', async (req, res) => {
    try{
        const pets = await Pets.find();
        return res.json(pets);
    } catch(err){
        return res.status(500).json({message: err.message});
    }
    
})

//Adding pets from file data.xlsx
app.post('/api/pet', async (req, res) => {
    try{
        for (let i = 0; i < data.length; i++) {
            const { name, type, breed, age } = data[i];
            const newPet = new Pets({ name, type, breed, age });
            const pet = await newPet.save();
        }
        res.status(201).redirect('/api/pet');
    } catch(err){
        res.status(400).json({message: err.message});
    }
    
});

//Sends a specific pet with id
app.get('/api/pet/:id', async (req, res) => {
    try{
        let thisPet = await Pets.findById(req.params.id);
        if(thisPet==null){
            return res.status(404).json({message: "Cannot find pet"});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    let thisPet = await Pets.findById(req.params.id);
    res.send(thisPet);
});

//Edit a pet
app.patch('/api/pet/:id', async (req, res) => {
    const {id} =req.params;
    // This request takes the data from the body of the Patch Request
    const { name, type, breed, age } = req.body;
    try{
        const thisPet = await Pets.findById(req.params.id);
        if(thisPet==null){
            return res.status(404).json({message: "Cannot find pet"});
        }
    }catch(err){
        return res.status(400).json({message: err.message});
    }
    const newPet = await Pets.findByIdAndUpdate(id, { name, type, breed, age  });
    res.redirect(`/api/pet/${id}`);
});

//Delete a pet
app.delete('/api/pet/:id', async (req, res) => {
    
    try{
        const tempPet = await Pets.findById(req.params.id);
        if(tempPet==null){
            return res.status(404).json({message: "Cannot find pet"});
        }
    }catch(err){
        return res.status(500).json({message: err.message});
    }
    await Pets.findByIdAndDelete(req.params.id);
    res.json({message: "Deleted Pet"});
});

//Catch all
app.all('*', (req, res) => {
    res.json("Invalid Request");
});





//Server
app.listen(3000, () => {
    console.log("On 3000!");
});
