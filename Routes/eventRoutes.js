import express from 'express';
import axios from 'axios';
import https from 'https'
import Event from '../Models/eventModel.js';
import { verifyUser } from '../config/jwtConfig.js';
import Registration from '../Models/registrationModel.js';

const router = express.Router();
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});

const apiUrl = 'http://localhost:3000';

router.get('/AllEvents', verifyUser, async (req, res) => {
    const action = req.query.action
    try {
        if (action === 'View' || action === "Cancel") {
            delete req.session.registeredCheck;

        }

        const events = await Event.find({});
        const registrationObj = await Promise.all(
            events.map(async (event) => {
                const count = await Registration.countDocuments({ eventId: event._id });
                return { eventId: event._id, count };
            })
        );

        let eventView = null;
        if (req.query.eventId) {
            eventView = await Event.findById(req.query.eventId);
        }

        if (req.query.cancelEvent) {
            console.log("cancel even: ", req.query.cancelEvent);

            await Registration.findOneAndDelete({
                eventId: req.query.cancelEvent,
                studentId: req.user.userId
            })
            await Event.findByIdAndUpdate(req.query.cancelEvent, {
                $inc: { capacity: 1 }
            })
            return res.redirect('/event/AllEvents');
        }

        let statusRegister = ''
        let registered = null
        if (req.session.registeredCheck) {
            statusRegister = req.session.registeredCheck.status
            console.log("statusRegister", statusRegister);

        }

        const alreadyRegistered = await Registration.find({ studentId: req.user.userId })
        // console.log("alreadyRegistered: ", alreadyRegistered);
        const alreadyRegisteredEventId = alreadyRegistered.map(register => register.eventId.toString())
        // console.log("alreadyRegisteredEventId: ", alreadyRegisteredEventId);




        res.render('registerEvent', {
            events,
            registrationObj,
            eventView,
            alreadyRegisteredEventId,
            registered,
            statusRegister,
            action
        });
    } catch (error) {
        res.json({ message: error.message });
    }
});


// router.get('/view/detailEvent/:id', async (req, res) => {
//     console.log("View");

//     const eventId = req.params.id
//     try {
//         const eventView = await Event.findById(eventId)

//         const events = await Event.find({})

//         const registrationObj = await Promise.all(
//             events.map(async (event) => {
//                 const countRegistrations = await Registration.countDocuments({ eventId: event._id });
//                 return {
//                     eventId: event._id,
//                     count: countRegistrations
//                 };
//             })
//         );

//         res.render('registerEvent', { events: events, registrationObj: registrationObj, eventView: eventView })

//     } catch (error) {
//         res.json({ message: error })
//     }

// })



export default router;