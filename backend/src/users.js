const express = require('express');
const bcrypt = require('bcrypt');
const usersRouter = express.Router();
const db = require('./db');

//update user
usersRouter.put('/:id', async (req, res, next) =>{
    console.log(req.body);
    try{
        const user_id = req.params.id;
        const { first_name, last_name, phone, address, email, password_hash } = req.body;
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        const hashedPassword = await bcrypt.hash(password_hash, salt);
        const query = 'UPDATE users SET first_name = $1, last_name = $2, phone = $3, address = $4, email = $5, password_hash = $6 WHERE id = $7';
        const values = [first_name, last_name, phone, address, email, hashedPassword, user_id];

        const result = await db.query(query, values);

        res.status(201).json('user updated');
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//post new user
usersRouter.post('/', async (req, res, next) => {
    try {
        console.log(req.body);// para teste ver se o servidor está recebendo os valores
        const { first_name, last_name, phone, address, email, password_hash } = req.body;
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        const hashedPassword = await bcrypt.hash(password_hash, salt);

        const query = 'INSERT INTO users (first_name, last_name, phone, address, email, password_hash) VALUES ($1, $2, $3, $4, $5, $6)';
        const values = [first_name, last_name, phone, address, email, hashedPassword];

        const result = await db.query(query, values);

        res.status(201).json('user registered');
    } catch (error) {
        console.error('Error registering user', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// all users
usersRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM users')
        .then(result => {
            res.json(result.rows);
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({error: 'An error occurred'});
        });
});

// users by ID
usersRouter.get('/:id', (req, res, next) => {
    console.log(req.params.id);
    console.log(req.params);
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [req.params.id];

    db.query(query, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});





     

module.exports = usersRouter;
