const express = require('express');
const router = express.Router();
const {Nodes, Geolocation, NodeHistoryState} = require('../models/nodes');


router.get('/nodes', async (req, res) => {
    try {
        const nodes = await Nodes.find({});
        nodes.forEach((_, index) => {
            nodes[index].history = nodes[index].history.splice(-10)
        })
        res.status(200)
            .send({
                message : ' Node fetched successfully',
                data : nodes
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})

router.post('/nodes', async (req, res) => {
    try {
        const {body} = req;
        const node = await Nodes.create({...body});
        if (node)
            return res.status(201)
                        .send({message : 'The node has been create successfully'})
        res.status(400)
            .send({message : 'Creation failed'})
    } catch (e) {
        res.status(400)
        .send({
            message : e.message
        })
    }
})

router.get('/node/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const node = await Nodes.findById(id);
        if (!node)
            res.status(404)
                .send({message : 'Node not found'})
        res.status(200)
            .send(history)
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})

router.put('/node/history/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const node = await Nodes.findById(id);
        if (!node)
            res.status(404)
                .send({message : 'Node not found'})

        node.history = [...node.history, {...req.body, date : Date.now()}];
        await node.save();
        res.status(200)
            .send({
                message : 'This node has been updated successfully'
            })
    } catch (e) {
        res.status(400)
            .send({
                message : e.message
            })
    }
})

module.exports = router