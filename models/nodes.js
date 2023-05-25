const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create nodes Schema & model
const NodeHistory = new Schema({
    temp : String,
    humidity : String,
    bar_pressure : String,
    vapor_pressure : String,
    date : Date
})


const NodesSchema = new Schema({
    name: {
        type: String,
        required: [true, 'node field is required']
    },
    location : {
        name : String,
        coordinates : [Number]
    },
    history : {
        type : [NodeHistory],
        default : []
    },
    isactive : {
        type : Boolean,
        default : false
    }
});


const Nodes = mongoose.model('nodes', NodesSchema);
module.exports = {Nodes};

