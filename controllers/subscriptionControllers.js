const Subscription = require("../models/Subscription");
const Meal = require("../models/Meal");
const User = require("../models/User");

const createSubscription = async (req, res) => {
    const user = req.session.user;

    if (!user)
        return res
            .status(401)
            .json({ err: "you don't have access to this url endpoint" });

    const { type, endDate, plans } = req.body;
    if (!type || !endDate)
        return res.status(400).json({ err: "incomplete fields" });

    const existingSub = await Subscription.findById(user.subscription);
    if (existingSub)
        return res.status(400).json({ err: "user already subscribed" });
    try {
        const newSub = await Subscription.create({
            user: user.id,
            type,
            endDate,
            plans,
        });

        await newSub.save();

        const currentUser = await User.findById(user.id);
        currentUser.subscription = newSub._id;
        await currentUser.save();

        return res.status(201).json({
            id: newSub._id,
            type,
            startDate: newSub.startDate,
            endDate,
            plans,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ err: "something went wrong" });
    }
};

const getSubscriptions = async (_, res) => {
    try {
        const subs = await Subscription.find({});
        return res.status(200).json({ subs });
    } catch (error) {
        return res.status(500).json({ err: "something went wrong" });
    }
};

const getSubscription = async (req, res) => {
    const { id } = req.params;

    try {
        const sub = await Subscription.findById(id);
        return res.status(200).json({ sub });
    } catch (error) {
        return res.status(500).json({ err: "something went wrong" });
    }
};

const updateSubscription = async (req, res) => {
    const { id } = req.params;
    const body = req.body;

    try {
        const sub = await Subscription.findById(id);

        for (let property in body) {
            if (property in sub) {
                sub[property] = body[property];
            }
        }

        return res.status(200).json({ sub });
    } catch (error) {
        return res.status(500).json({ err: "something went wrong" });
    }
};

module.exports = {
    createSubscription,
    getSubscription,
    getSubscriptions,
    updateSubscription,
};
