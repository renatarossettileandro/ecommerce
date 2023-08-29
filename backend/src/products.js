const express = require('express');
const db = require('./db.js');
const productsRouter = express.Router();


//params para id
productsRouter.param('id', (req, res, next)=>{
    const products_id = req.params.id;
    next();
});

// display produto por nome
productsRouter.get('/name/:name', (req, res, next) => {
    const query = 'SELECT * FROM products WHERE name = $1';
    const values = [req.params.name];

    db.query(query, values)
        .then(result => {
            const foundProduct = result.rows[0];

            if (foundProduct) {
                res.json(foundProduct);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});

//display todos os produtos
productsRouter.get('/', (req, res, next)=>{

    db.query('SELECT * FROM products')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error('Error executing query', err);
        res.status(500).json({error: 'An error occurred'});
    });

});

// display produto por id
productsRouter.get('/:id', (req, res, next) =>{
    const query = 'SELECT * FROM products WHERE id = $1';
    const values = [req.params.id];
    console.log(values);

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







module.exports = productsRouter;