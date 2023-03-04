require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {WebSocketServer} = require('ws');

const {Nodes} = require('./models/nodes')

//set up express app 
const app = express();


app.use(cors());
// connect to mongodb
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());

//initialize routes
app.use('/api', require('./routes/api'));

const updateSocket = new WebSocketServer({noServer : true});

updateSocket.on('connection', (socket, req) => {
    const id = req.url.split('/')[2];

    console.log("The socket has been connecte => ", id);

    // console.log(socket)
    socket.send(JSON.stringify({
        message : 'The socket has been connected'
    }))
    setInterval(
        async function () {
            // console.log(socket)
            const nodes = await Nodes.findById(id);
            socket.send(JSON.stringify({
                data : nodes.history.slice(-10)
            }))
        }, 1000
    )

    socket.on("close",() => {
        console.log('the socket has disconnected')
    })
})

//error handling middleware
app.use(function(err,req,res,next){
    //console.log(err);
    res.status(422).send({error: err.message});
});

//list for requests 
const server = app.listen(process.env.port || 4000, function(){
    console.log('now listening for requests');
    console.log('WTF')
});

server.on('upgrade', (req, socket, head) => {
    const path = req.url.split('/')[1];
    console.log(path)
    if (path === 'ws') {
        updateSocket.handleUpgrade(req, socket, head, ws => {
            updateSocket.emit('connection', ws, req);
        });
    } else {
        socket.destroy();
    }
})