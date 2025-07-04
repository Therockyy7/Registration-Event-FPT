import express from 'express';
import passport from 'passport';

import { deleteRegistration, getRegistrationsByDate, listRegistrations, registration } from '../Controllers/registrationController.js';
import Registration from '../Models/registrationModel.js';
import { verifyAdmin, verifyUser } from '../config/jwtConfig.js';

import axios from 'axios';
import https from 'https'
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const apiUrl = 'http://localhost:3000';

const router = express.Router();

router.post('/registrations', verifyUser, registration)

router.get('/registrations/:registrationId', verifyUser, deleteRegistration)

router.get('/listRegistrations', verifyAdmin, async (req, res) => {
    try {
        const listRegistration = await Registration.find({})
        if (!listRegistration) return res.status(400).json({ message: 'Not have any Registration' });
        console.log("Hello: ", req.user.role);

        console.log("registration: ", listRegistration);

        res.render('listRegistrations', {
            listRegistration: listRegistration
        })

    } catch (error) {
        res.json({ message: error.message })
    }
})

router.get('/getRegistrationsByDate', verifyAdmin, getRegistrationsByDate);

router.get('/gotoSearchRegistrationPage', verifyAdmin, async (req, res) => {
    res.render('searchRegistrations')
})

router.post('/handleFindRegistrationByDate', verifyAdmin, async (req, res) => {
    const { startDate, endDate } = req.body
    console.log("Start: ", startDate);
    console.log("End: ", endDate);

    try {
        const response = await axiosInstance.get(`${apiUrl}/getRegistrationsByDate?start=${startDate}&end=${endDate}`,
            {
                headers: {
                    Authorization: `Bearer ${req.session.token}`,
                    'Content-Type': 'application/json'
                }
            })

        console.log("Respone " + `${apiUrl}/getRegistrationsByDate?start=${startDate}&end=${endDate}`);


        res.render('listRegistrations', {
            listRegistration: response.data.registrationsAfterFound
        })

    } catch (error) {
        res.json({ message: error.message })
    }

})


router.get('/register/:id', verifyUser, async (req, res) => {
    const eventId = req.params.id
    const userId = req.user.userId
    console.log("eventId /register/:id: " + eventId);
    console.log("Userid /register/:id: " + userId);

    try {
        const response = await axiosInstance.post(`${apiUrl}/registrations`, {
            studentId: userId,
            eventId: eventId
        }, {
            headers: {
                Authorization: `Bearer ${req.session.token}`,
                'Content-Type': 'application/json'
            }
        })

        console.log("response: ", response);


        if (response.data.message === 'register successful') {
            req.session.registeredCheck = {
                status: 'Successful'
            }
            res.redirect(`/event/AllEvents`)
        } else {
            res.json({ message: "Error register" })
        }

    } catch (error) {
        console.log("Error details:", error.response?.data);
        res.json({ message: "at /register/:id - " + error.message })
    }

})





export default router;