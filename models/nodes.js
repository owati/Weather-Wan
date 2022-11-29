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
    available: {
        type : Boolean, 
        default: false
    },
    geometry: GeoSchema
});

const Nodes = mongoose.model('nodes', NodesSchema);
const GeoLocations = mongoose.model('geo', GeoSchema);

module.exports = {Nodes, GeoLocations};

function newFunction() {
    GeoSchema.nodes({ "loc": "2dsphere" });
}
