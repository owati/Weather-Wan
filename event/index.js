const EventEmitter = require('node:events');

class MyEventEmitter extends EventEmitter {
    socketServer;
    constructor (socketServer) {
        super();
        this.socketServer = socketServer;
    }

    prepareEvents () {
        this.on('node-change', (nodeId, newData) => {
            console.log('Detected node change on node => ', nodeId)
            this.socketServer.clients.forEach(client => {
                if (client.nodeId === nodeId)
                    client.send(JSON.stringify({
                        data : newData
                    }))
            });
        })
    }
}

module.exports = MyEventEmitter;