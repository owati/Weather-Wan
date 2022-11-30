require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

//set up express app 
const app = express();


app.use(cors({
    origin : ['*']
}))
// connect to mongodb
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());

//initialize routes
app.use('/api', require('./routes/api'));

//error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

//list for requests 
app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
});
