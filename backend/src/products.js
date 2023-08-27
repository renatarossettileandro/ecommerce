const express = require('express');
const productsRouter = express.Router();

let products = [];

//display lista de produtos
productsRouter.get('/', (req, res, next)=>{

    res.send(products);

});

// adicionar um novo produto no new_orders
productsRouter.get('/:id', (req, res, next) =>{
   
});
//enviar novo pedido para new_orders ou atualizar quantidade
productsRouter.put('/:id', (req, res, next) =>{

});

module.exports = productsRouter;