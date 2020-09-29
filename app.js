const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const crypto = require('crypto')
var key ='password';
var algo = 'aes256';
const User = require('./models/users');

mongoose.connect('mongodb+srv://avenger:Lr2nN3zVGaXNKGcw@cluster0.cvfas.mongodb.net/tutorial?retryWrites=true&w=majority',
    {
        useNewUrlParser:true,
        useUnifiedTopology:true
    }
).then(()=>{
    console.warn('connected');
})

app.post('/register',jsonParser,function(req,res){
    var cipher = crypto.createCipher(algo,key); 
    var encrypted = cipher.update(req.body.password,'utf8','hex')+cipher.final('hex');

    var data = new User({
        _id:mongoose.Types.ObjectId(),
        name:req.body.name,
        email:req.body.email,
        password:encrypted,
        });
    
    data.save().then((result)=>{
        res.json(result)
    })
    
});
app.listen(4000);