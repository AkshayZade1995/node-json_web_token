const express = require('express');
const app = express();
const mongoose = require('mongoose');
const User = require('./models/users');

mongoose.connect('mongodb+srv://avenger:Lr2nN3zVGaXNKGcw@cluster0.cvfas.mongodb.net/tutorial?retryWrites=true&w=majority',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.warn('connected to mongodb terminal');
})

app.get('/',function(req,res){
    res.end('Hello')
});
app.listen(4000);