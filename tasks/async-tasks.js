//Boss Philip, this is a file that is used to automatically populate the Order Collection in the Database.
//Let me explain my thought process.
//So, in Foodsub there are users who subscribe for meals. A subscription is simply a record of what meal a user wants and at what time. It repeats every week.
//But if you check the figma file it is possible to change the meal that a user wants, for just one day.
//This change shouldn't be made to the subscription itself since it is ony for that that day.
//That's why I thought about creating another collection caled 'Orders'.
//However this collection would be dynamically populated by the server based on the code I have written below.
//It is based on orders that the service provider knows what meals should be delivered for that day.
//So at intervals, the server looks through all our subscriptions and determines if there is a plan that exists for that day.
//If there is then it looks through orders to see if a user made any change for that particular day. If not it creates a new order based on the details gotten from the subscription
//Please check my comments in case there is something you don't understand.

console.log("running async script...");

const Subscription = require("../models/Subscription");
const Order = require("../models/Order");
const Meal = require("../models/Meal");

const interval = 60 * 1000;

const dayOfWeekMap = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const updateOrdersList = async () => {
    const currentDate = new Date(Date.now());
    let todayDateinMS = new Date().setHours(0, 0, 0);
    //I need today's date because that is what i use to query the orders to know if an order already exists for today

    const today = dayOfWeekMap[currentDate.getDay()]; //this tells if today is monday or tuesday...

    const subscriptions = await Subscription.find({});

    subscriptions.forEach(async (sub) => {
        const { _id, plans, endDate } = sub;
        if (endDate - todayDateinMS <= 0) return; //if todays date is greater than the date the subscription is supposed to end, nothing happens.

        for (let day in plans) {
            if (day !== today) continue; // if it isn't today, skip
            if (plans[day].length < 1) return;

            let orders = await Order.find({
                subscriptionId: _id,
            });

            orders = orders.filter(
                (order) =>
                    order.deliveryTime.getTime() > todayDateinMS &&
                    order.deliveryTime.getTime() < todayDateinMS + 86400000 //today + 24 hours
            );

            //the above query simply finds an order that may exist in the collection.
            //The query simply checks if the deliveryTime in the order document falls within today.
            //It might change in the future.

            if (orders.length > 0) return; //if an order already exists i want to do nothing.

            //if it doesn't exist...

            console.log("making orders...");
            plans[day].forEach(async (plan) => {
                timeArr = adJustToNigerianTime(plan.deliveryTime);
                const deliveryTime = new Date().setHours(...timeArr);
                const { meal: mealId } = plan;
                const meal = await Meal.findById(mealId);

                const newOrder = new Order({
                    subscriptionId: _id,
                    deliveryTime: new Date(deliveryTime),
                    meal,
                    deliveryCost: 1000,
                });

                await newOrder.save();
            });
        }
    });
};

// this function is necessary to convert the time from the default GMT to nigerian time which is GMT + 1
function adJustToNigerianTime(timeArr) {
    resArr = timeArr;
    resArr[0] = resArr[0] === 23 ? 0 : resArr[0] + 1;
    return resArr;
}

(function loop() {
    setTimeout(async () => {
        await updateOrdersList();
        loop();
    }, interval);
})();
