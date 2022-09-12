const Subscription = require("../models/Subscription")

const createSubscription = async (req, res) => {
    const {user, type, startDate, endDate, plans} = req.body
    if (!user || !type || !startDate || !endDate) return res.status(400).json({err: 'incomplete fields'})

    try {
        const newSub = await Subscription.create({user, type, startDate, endDate, plans, type})
        return res.status(200).json({newSub});
    } catch (error) {
        return res.status(500).json({err: 'something went wrong'})
    }
}

const getSubscriptions = async (req, res) => {
    try {
        const subs = await Subscription.find({})
        return res.status(200).json({subs})
    } catch (error) {
        return res.status(500).json({err: 'something went wrong'})
    }
}

const getSubscription = async (req, res) => {
    const {id} = req.params
    try {
        const sub = await Subscription.findById(id)
        return res.status(200).json({sub})
    } catch (error) {
        return res.status(500).json({err: 'something went wrong'})
    }
}

const updateSubscription = async (req, res) => {
    const {id} = req.params
    const body = req.body

    try {
        const sub = await Subscription.findById(id)

        for (let property in body) {
            if (property in meal) {
                meal[property] = body[property];
            }
        }

        return res.status(200).json({sub})
    } catch (error) {
        return res.status(500).json({err: 'something went wrong'})
    }
}

const deleteSubscription = async (req, res) => {
    res.send('delete')
}


module.exports = {createSubscription, getSubscription, getSubscriptions, updateSubscription, deleteSubscription}