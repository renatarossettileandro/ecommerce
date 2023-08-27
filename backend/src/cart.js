const express = require('express');
const cartRouter = express.Router();

//mostrar lista de pedidos
cartRouter.get('/', (req, res, next) => {
    
});

//atualizar quantidade de um item
cartRouter.put('/:id', (req, res, next) =>{

});
// deletar um item
cartRouter.delete('/:id', (req, res, next) => {

});

module.exports = cartRouter;