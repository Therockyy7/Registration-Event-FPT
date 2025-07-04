import express from 'express';
import { signup, login } from '../Controllers/authController.js';
import axios from 'axios';
import https from 'https'

const router = express.Router();
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const apiUrl = 'http://localhost:3000';

router.post('/signup', signup);
router.post('/login', login);

router.post('/handleLogin', async (req, res) => {
    const { username, password } = req.body
    console.log(username, password);

    try {
        const response = await axiosInstance.post(`${apiUrl}/auth/login`, {
            username: username,
            password: password
        });
        console.log("message: " + response.data.message);
        // console.log(response);

        if (response.data.message === 'Login successful') {
            const roleUser = response.data.user.role
            const token = response.data.token

            if (roleUser === 'student') {
                req.session.token = token
                res.redirect('/event/AllEvents')
            } else if (roleUser === 'admin') {
                req.session.token = token
                res.redirect('/listRegistrations')
            }

        } else {
            res.render('login', { checkLogin: false })
        }


    } catch (error) {
        res.render('login', { checkLogin: false });
    }


})

export default router;