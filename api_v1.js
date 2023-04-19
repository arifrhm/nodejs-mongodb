const express = require('express');
const mongodb = require('mongodb');
const {connect} = require('./db');

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        const db = await connect();
        const result = await db.collection('users').insertOne({ username, password });
        const user = await db.collection('users').findOne({ _id: result.insertedId });
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const db = await connect();
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single user
router.get('/users/:id', async (req, res) => {
    try {
        const db = await connect();
        const user = await db.collection('users').findOne({ _id: new mongodb.ObjectID(req.params.id) });
        if (!user) throw new Error('User not found');
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Update a user
router.put('/users/:id', async (req, res) => {
    try {
        const db = await connect();
        const result = await db.collection('users').updateOne(
            { _id: new mongodb.ObjectID(req.params.id) },
            { $set: req.body }
        );
        if (result.modifiedCount === 0) throw new Error('User not found');
        const user = await db.collection('users').findOne({ _id: new mongodb.ObjectID(req.params.id) });
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const db = await connect();
        const result = await db.collection('users').deleteOne({ _id: new mongodb.ObjectID(req.params.id) });
        if (result.deletedCount === 0) throw new Error('User not found');
        res.sendStatus(204);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

module.exports = router;
