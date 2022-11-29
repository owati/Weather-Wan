const express = require('express');
const router = express.Router();
const {Nodes, Geolocation} = require('../models/nodes');

//get a list of nodes from the db
router.get('/nodes', function(req,res,next){
    if (req.query.name) {
        Nodes.find({node : req.query.name}).then(val => res.status(200).send({data : val}));
        return;
    }
    Nodes.aggregate([{ $geoNear: { near: {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]}, spherical: true, maxDistance: 100000, distanceField: "dist.calculated" } }]).then(function(results){ res.send(results); });
    
});





// router.get('/nodes/geo/:lattitude/:longitude', async function (req, res, next) {
//     try {
//         const {lattitude, longitude} = req.params;
//         const geo = await Geolocation.findOne({coordinates : [lattitude, longitude]});
    
//         const nodes = await Nodes.find({geometry : geo});
    
//         res.status(200)
//             .send({
//                 messages : 'fetch successfull',
//                 data : nodes
//             })
//     } catch (e) {
//         res.status(400)
//             .send({
//                 message : e.message
//             })
//     }
// })

//add a new node to the db
router.post('/nodes', async function(req,res,next){
    try {
        const node = await Nodes.create(req.body);
        console.log(node);
    
        res.status(200)
            .send({
                message : 'node created successfully',
                data : node
            })

    } catch (e) {
        console.log(e.message)
    }
         
});

//update a node in the db
router.put('/nodes/:id', function(req,res,next){
    Nodes.findByIdAndUpdate({_id:req.params.id}, req.body).then(function(){
        Nodes.findOne({_id:req.params.id}).then(function(nodes){
            res.send(nodes);
        });
    });
   
});

//delete a node from the db
router.delete('/nodes/:id', function(req,res,next){
    Nodes.findByIdAndRemove({_id:req.params.id}).then(function(nodes){
        res.send(nodes);
    });
});

module.exports = router;