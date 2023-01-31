const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//create geolocation Schema
const GeoSchema = new Schema({
    "type": {
      type:String,
      default: "Point"
    },
    coordinates: {
        type : [Number],
        required : true

    }
});

//create nodes Schema & model
const NodesSchema = new Schema({
    node: {
        type: String,
        required: [true, 'node field is required']
    },
    temp: {
        type: String,
    },
    humidity: {
        type: String
    },
    bar_pressure : {
        type : String,
    },
    vapor_pressure : {
        type : String
    },
    available: {
        type : Boolean, 
        default: false
    },
});

const NodeHistory = new Schema({
    temp : String,
    humidity : String,
    bar_pressure : String,
    vapor_pressure : String,
    date : Date
})

const NodeHistoryStateSchema = new Schema({
    node : {
        type : String,
        required : [true, 'The node field is required']
    },
    history :  {
        type : [NodeHistory],
        default : []
    }

})

const TestSchema = new Schema({
    value : String
})
const Nodes = mongoose.model('nodes', NodesSchema);
const GeoLocations = mongoose.model('geo', GeoSchema);
const Test = mongoose.model('test', TestSchema);
const NodeHistoryState = mongoose.model('Node History', NodeHistoryStateSchema);

module.exports = {Nodes, GeoLocations, Test, NodeHistoryState};

function newFunction() {
    GeoSchema.nodes({ "loc": "2dsphere" });
}
