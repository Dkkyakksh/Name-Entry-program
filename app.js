const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { create } = require('domain');
const { read } = require('fs');
dotenv.config();

const dbService = require("./dbfile");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended : false}));

// create
app.post('/insert', (request,response)=>{
    //post-when you want to create new data
    const { name } = request.body;
    const db = dbService.getdbserviceinstance();

    const result = db.insertNewName(name);

    result
    .then(data => response.json({data : data}))
    .catch(err=> console.log(err));
});

// read
app.get('/getALL', (request, response)=>{
    const db = dbService.getdbserviceinstance();
    
    const result = db.getAllData();
    result
    .then(data=>response.json({data : data}))
    .catch(err=> console.log(err));
})


// update
app.patch('/update', (request, response)=>{
    const db = dbService.getdbserviceinstance();
    const { id, name } = request.body;


    const result = db.updateNameById(id, name);

    result
    .then(data=>response.json({success: data}))
    .catch(err=> console.log(err));
})


// delete
app.delete('/delete/:id', (request,response)=>{
    const { id } = request.params;///:id is written as it is for request.param, it extracts info from URL.
    //                                                                          Hence this format
    const db = dbService.getdbserviceinstance();

    const result = db.deleteRowById(id);

    result
    .then(data=>response.json({success: data}))
    .catch(err=> console.log(err));
})

app.get('/search/:name', (request, response)=>{
    const { name } = request.params;
    const db = dbService.getdbserviceinstance();

    const result = db.searchByName(name);

    result
    .then(data=>response.json({data : data}))
    .catch(err=> console.log(err));
})

app.listen(process.env.PORT, ()=>console.log("App is running"));