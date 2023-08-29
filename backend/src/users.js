const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const usersRouter = express.Router();
const db = require('./db');


//configuração a estratégia local de autenticação
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },

    async (email, password, done) =>{
        try{
            //confirmando email se for não encontrado já da mensagem de erro
            const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
            if(!user.rows.length){
                return done(null, false, {message: 'User not foung'});
            }
            //confirmando senha se for falso dar mensagem de erro
            const isPasswordValid = await bcrypt.compare(password, user.rows[0]. password_hash);
            if(!isPasswordValid){
                return done(null, false, {message: 'Invalid password'});
            }
            // caso passe nos dois testes
            return done(null, user.rows[0]);
        }catch(error){
                return done(error);
            }
            
    }

));

//Configurar serializerUser e deserializeUser -- aqui deve ter cuidado para colocar item que irá buscar o usuario
//pode ser id, email, usuario, usar o valor correto
passport.serializeUser((user, done) =>{
    done(null, user.email);
});

passport.deserializeUser(async(email, done) =>{
    try{
        console.log(email);
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        done(null, user.rows[0]);
    } catch(error){
        done(error);
    };
});

//Middlewares
usersRouter.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false
}));

usersRouter.use(passport.initialize());
usersRouter.use(passport.session());

//rota de login
usersRouter.post('/login', passport.authenticate('local'), (req, res, next) =>{
    res.json({message: 'Login sucecessful', user: req.user});
});

//Rota para retornar perfil do usuario caso o login tenha sido autenticado
usersRouter.get('/profile', (req, res, next) =>{
    if(req.isAuthenticated()){
        res.json({user: req.user})
    }else{
        res.status(401).json({message: 'Unauthorized'});
    }
});

//Rota para logoout
usersRouter.get('/logout', (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session', err);
        }
        res.redirect('/users');
    });
});

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
