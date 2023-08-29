const express = require('express');
const db = require('./db.js');
const cartsRouter = express.Router();

// adicionar um pedido novo
cartsRouter.post('/', async(req,res,next) =>{
    try{
        const {product_id, quantity, status, user_id} = req.body;
        const query = 'INSERT INTO new_orders (product_id, quantity, status, user_id) VALUES ($1, $2, $3, $4)';
        const values = [product_id, quantity, status, user_id];

        const result = await db.query(query,values);
        res.json('New order registered');

        if (result.rowCount > 0) {
            const orderId = result.rows[0].id; // Pegar o ID retornado
            const orderQuery = 'INSERT INTO orders (new_orders_id) VALUES ($1)';
            const orderValues = [orderId];
    
            await db.query(orderQuery, orderValues);
        }

    }catch(error){
        console.log('Error executing query', error);
        res.status(500).json({error:'An error occurred'});
    };
});

// alterar valor do pedido por id
cartsRouter.put('/:id/quantity', async(req, res, next) =>{
    try{
        const{quantity} = req.body;
        const query = 'UPDATE new_orders SET quantity = $1 WHERE id = $2 AND status = $3';
        const values = [quantity, req.params.id, 'Pending'];
        
        const result = await db.query(query, values);
        res.json('New quantity registered');
    } catch(error){
        console.log('Error executing query', error);
        res.status(500).json({error:'An error occurred'});
    }
});

//deletar um pedido
cartsRouter.put('/:id', async (req, res, next) => {
    try {
        const query = 'UPDATE new_orders SET status = $1 WHERE id = $2 AND status = $3';
        const values = ['canceled', req.params.id, 'Pending'];

        const result = await db.query(query, values);
        res.json('Order canceled');
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//mostrar lista de pedidos
cartsRouter.get('/', (req, res, next) => {
    db.query('SELECT * FROM new_orders')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error('Error executing query', err);
        res.status(500).json({error: 'An error occurred'});
    });
});

//mostrar lista de pedidos por id
cartsRouter.get('/:id', (req,res,next)=>{
    const query = 'SELECT * FROM new_orders WHERE id = $1';
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

//validar cart para checkout
cartsRouter.get('/:id/checkout', (req, res, next) => {
    const query = 'SELECT * FROM new_orders WHERE id = $1';
    const values = [req.params.id];
    //verificando se o cart tem pedidos para fazer checkout
    db.query(query, values)
        .then(result => {
            if(result.rows.length){
                //logica para todos os pagamentos são aprovados
                res.json({ message: 'Checkout successful', order: result.rows[0] });
            } else {
                res.status(404).json({error: 'Your cart is empty'});
            }
        })
        .catch(err =>{
            console.error('Error executing query', err);
            res.status(500).json({error: 'An error occured'});
        });

});



module.exports = cartsRouter;