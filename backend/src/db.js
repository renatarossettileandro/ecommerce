const { Client } = require('pg');

const db = new Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/boardGames',
});


// conectando ao bando de dados
db.connect()
    .then(() =>{
        console.log('Connected to the database');
    })
    .catch(err =>{
        console.log('Error connecting to the database', err);
    });

    module.exports= db;
