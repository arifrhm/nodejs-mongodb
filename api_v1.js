const express = require('express');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');
const { connect } = require('./db1');
const auth = require('./jwt');
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
router.get('/users', auth, async (req, res) => {
    try {
        const db = await connect();
        const users = await db.collection('users').find().toArray();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Create genreate token endpoint
async function login(req, res) {
    try {
        // Check if user exists and password is correct
        const db = await connect();
        const user = await db.collection('users').findOne({ username: req.body.username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) return res.status(400).json({ error: 'Invalid username or password' });
        // Generate JWT token and send back to client
        const token = generateToken(user);
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
// Login endpoint
router.post('/login', login);

// Get a single user
router.get('/users/:id', auth, async (req, res) => {
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
router.put('/users/:id', auth, async (req, res) => {
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
router.delete('/users/:id', auth, async (req, res) => {
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
