const express = require('express');
const User = require('./user');
const connect = require('./db');

const router = express.Router();

// Create a new user
router.post('/users', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = new User({ username, password });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get a single user
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) throw new Error('User not found');
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Update a user
router.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!user) throw new Error('User not found');
        res.json(user);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

// Delete a user
router.delete('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) throw new Error('User not found');
        res.sendStatus(204);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

module.exports = router;
