import express from 'express';
import mongoose from 'mongoose';
// import dotenv from 'dotenv';
import authRouter from './Routes/authRoutes.js';
import registrationRouter from './Routes/registrationRoutes.js'
import eventRouter from './Routes/eventRoutes.js'


import { jwtPassport, verifyAdmin } from './config/jwtConfig.js';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';
import { connectToMongoDB } from './db/connectToMongoDB.js';

import session from 'express-session';
import sessionConfig from './config/sessionConfig.js';

// dotenv.config();

const app = express();
app.use(express.json());
// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.use(session(sessionConfig));

app.use(jwtPassport.initialize());


app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', async (req, res) => {
    res.render('partials/index');
})

app.use('/auth', authRouter);
app.use('/', registrationRouter)
app.use('/event', eventRouter)

// app.use('/registrationView', verifyAdmin, registrationRouter)


const PORT = 3000;
app.listen(PORT, () => {
    connectToMongoDB()
    console.log(`Server running at http://localhost:${PORT}`);
});