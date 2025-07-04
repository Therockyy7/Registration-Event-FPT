
import User from '../Models/userModel.js';
import Registration from '../Models/registrationModel.js';
import Event from '../Models/eventModel.js';


export const registration = async (req, res) => {
    const { studentId, eventId } = req.body

    try {
        const student = await User.findById(studentId)
        if (!student) return res.status(400).send('User not found')

        const event = await Event.findById(eventId)
        if (!event) return res.status(400).send('event not found')

        if (event.capacity <= 0) {
            return res.status(400).json({ message: 'Event is full' });
        }

        const alreadyRegistered = await Registration.findOne({ studentId, eventId });
        if (alreadyRegistered) {
            return res.status(400).json({ message: 'You have already registered for this event' });
        }

        const registration = await Registration.create({
            studentId,
            eventId
        })

        await Event.findByIdAndUpdate(event._id, {
            $inc: { capacity: -1 }
        })

        res.status(201).json({ message: 'register successful', registration });

    } catch (error) {
        res.json({ message: "at registration" + error.message })
    }

}

export const deleteRegistration = async (req, res) => {
    const registrationId = req.params.registrationId
    try {
        const registration = await Registration.findById(registrationId)
        if (!registration) return res.status(400).json({ message: "RegistrationId not found" })

        await Registration.findByIdAndDelete(registration._id)
        res.status(200).json({ message: "Delete successful" })

    } catch (error) {
        res.json({ message: error.message })
    }

}

export const listRegistrations = async (req, res) => {
    try {
        const listRegistration = await Registration.find({})
        if (!listRegistration) return res.status(400).json({ message: 'Not have any Registration' });
        console.log("Hello: ", req.user.role);




    } catch (error) {
        res.json({ message: error.message })
    }
}

export const getRegistrationsByDate = async (req, res) => {
    const { start, end } = req.query;

    // Kiểm tra thiếu tham số
    if (!start || !end) {
        return res.status(400).json({ message: 'Missing start or end date' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    // Kiểm tra ngày không hợp lệ
    if (isNaN(startDate) || isNaN(endDate)) {
        return res.status(400).json({ message: 'Invalid date format' });
    }

    // Kiểm tra ràng buộc: start < end
    if (startDate >= endDate) {
        return res.status(400).json({ message: 'Start date must be earlier than end date' });
    }

    try {
        const registrationsAfterFound = await Registration.find({
            registrationDate: {
                $gte: startDate,
                $lte: endDate
            }
        });

        res.json({ total: registrationsAfterFound.length, registrationsAfterFound });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}