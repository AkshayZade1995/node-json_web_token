const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();
const crypto = require('crypto')
var key = 'password';
var algo = 'aes256';
//jwt
const jwt = require('jsonwebtoken');
jwtKey = "jwt";
const User = require('./models/users');
const { json } = require('body-parser');

mongoose.connect('mongodb+srv://avenger:Lr2nN3zVGaXNKGcw@cluster0.cvfas.mongodb.net/tutorial?retryWrites=true&w=majority',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
).then(() => {
    console.warn('connected');
})

app.post('/register', jsonParser, function (req, res) {
    var cipher = crypto.createCipher(algo, key);
    var encrypted = cipher.update(req.body.password, 'utf8', 'hex') + cipher.final('hex');

    var data = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: encrypted,
    });

    data.save().then((result) => {
        jwt.sign({ result }, jwtKey, { expiresIn: '300s' }, (err, token) => {
            res.status(201).json({ token })
        })
        //res.json(result)
    })
});

app.post('/login', jsonParser, function (req, res) {
    User.findOne({ name: req.body.name }).then((data) => {
        var decipher = crypto.createDecipher(algo, key);
        var decrypted = decipher.update(data.password, 'hex', 'utf8') + decipher.final('utf8');
        if (decrypted == req.body.password) {
            jwt.sign({ data }, jwtKey, { expiresIn: '300s' }, (err, token) => {
                res.status(200).json({ token });
            })
        }
    })
})

app.get('/users', verifyToken, function (req, res) {
    User.find().then((result) => {
        res.status(200).json(result)
    })
})

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader != 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];
        jwt.verify(req.token, jwtKey, (err, authData) => {
            if (err) {
                res.json(err)
            }
            else {
                next();
            }
        })
    }
    else {
        res.send({ 'result': 'Token Not Provided' });
    }

}

app.listen(4000);