require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const {WebSocketServer} = require('ws');

const {Nodes} = require('./models/nodes')
const ApiHandler = require('./routes/api')

const MyEventEmitter = require('./event');
//set up express app 
const app = express();


app.use(cors());
mongoose.connect(process.env.MONGO_URL);
mongoose.Promise = global.Promise;

app.use(express.static('public'));

app.use(bodyParser.json());


// Set up the update socket for graph
const updateSocket = new WebSocketServer({noServer : true});

updateSocket.on('connection', async (socket, req) => {
    const id = req.url.split('/')[2];
    socket.nodeId = id
    console.log("The socket has been connecte => ", id);

    // console.log(socket)
    const nodes = await Nodes.findById(id);
    socket.send(JSON.stringify({
        data : nodes.history.slice(-10)
    }))
    // setInterval(
    //     async function () {
    //         // console.log(socket)
    //         const nodes = await Nodes.findById(id);
    //         socket.send(JSON.stringify({
    //             data : nodes.history.slice(-10)
    //         }))

    //         updateSocket.clients.forEach(client => console.log(client))
    //     }, 1000
    // )

    socket.on("close",() => {
        console.log('the socket has disconnected')
    })
})


// event handling configuration
const eventHandler = new MyEventEmitter(updateSocket);
eventHandler.prepareEvents();

app.use(express.static(path.resolve(__dirname, './build')));

app.use('/api', new ApiHandler(eventHandler).getRouter());

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './build', 'index.html'));
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