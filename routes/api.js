const express = require('express');
const router = express.Router();
const {Nodes, Geolocation, NodeHistoryState} = require('../models/nodes');

//get a list of nodes from the db
router.get('/nodes', function(req,res,next){
    if (req.query.name) {
        Nodes.find({node : req.query.name}).then(val => res.status(200).send({data : val}));
        return;
    }
    if (req.query.lat && req.query.lng) {
        Nodes.aggregate([{ $geoNear: { near: {type: 'Point', coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]}, spherical: true, maxDistance: 100000, distanceField: "dist.calculated" } }])
        .then(function(results){ res.send(results); });
    }
    Nodes.find().then(val => res.send({data : val}))
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
    console.log('Test the ')
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

router.put('/nodes/history/:id', async function (req, res) {
    console.log('Updating the Node history');
    try {
        const {id} = req.params;
        const {body} = req;

        const node = await Nodes.findById(id);

        if (!node)
            return res.status(422)
                      .send({message : 'The id sent is invalid'});
                      
        let [nodehistory] = await  NodeHistoryState.find({node : id});
        if (!nodehistory)
            nodehistory = await NodeHistoryState.create({node : id});
        console.log(nodehistory, node, "=> node history")
        if (nodehistory.history?.length < 10) {
            nodehistory.history = [...nodehistory.history, {...body, date : Date.now()}];
            await nodehistory.save();
            return res.status(200)
                        .send({
                            message : 'The history is updated',
                            data : nodehistory
                        })
        }

        const history = [...nodehistory.history];
        const randNum = Math.floor(Math.random() * 9) + 1;
        history.splice(randNum, randNum);
        history.push({...body, date : Date.now()})
        nodehistory.history = history;
        await nodehistory.save();

        return res.status(200)
                 .send({
                    message : "The histoy is updated",
                    data : nodehistory
                 })
        
    } catch(e) {
        console.log(e.message);
    }
})

//update a node in the db
router.put('/nodes/:id', function(req,res,next){
    console.log('Someting came in from the derver')
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

router.post('/test', async (req, res)=> {

})
module.exports = router;