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



//Notes Index Page

var sheet = xlsx.readFile('data.xlsx'); //got the file
var wb = sheet.Sheets['Sheet1']; //got the sheet
var data = xlsx.utils.sheet_to_json(wb); // sheet data in JSON

app.get('/api/pet', async (req, res) => {
    const pets = await Pets.find();
    res.send(pets);
})

//Adding pets from file
app.post('/api/pet', async (req, res) => {
    for (let i = 0; i < data.length; i++) {
        const { name, type, breed, age } = data[i];
        const newPet = new Pets({ name, type, breed, age });
        const pet = await newPet.save();
    }
    res.redirect('/api/pet');
});

//Sends a specific pet with id
app.get('/api/pet/:id', async (req, res) => {
    const { id } = req.params;
    const thisPet = await Pets.findById(id).exec();
    res.send(thisPet);
});

//Edit a pet
app.patch('/api/pet/:id', async (req, res) => {
    const { id } = req.params;
    // This request takes the data from the body of the Patch Request
    const { name, type, breed, age } = req.body;
    const newPet = await Pets.findByIdAndUpdate(id, { name, type, breed, age  });
    res.redirect(`/api/pet/${id}`);
});

//Delete a pet
app.delete('/api/pet/:id', async (req, res) => {
    const { id } = req.params;
    await Pets.findByIdAndDelete(id);
    res.redirect('/api/pet');
});


//Catch all
// app.all('*', (req, res, next) => {
//     next(new ExpressError('Page Not Found', 404));
// });

//Error handling
// app.use((err,req,res,next)=>{
//     const {statusCode = 500} = err;
//     if(!err.message) err.message = "Something Went Wrong!"
//     res.status(statusCode).render('error', {err});
// });



//Server
app.listen(3000, () => {
    console.log("On 3000!");
});
