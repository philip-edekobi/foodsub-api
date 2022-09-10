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


const Subscription = require('../models/Subscription')
const Order = require('../models/Order');

const interval = 60000 //milliseconds //60 seconds //this could change


const dayOfWeekMap = ["Sunday",'Monday', "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

const updateOrdersList = async () => {
    const currentDate = new Date(Date.now())
    const todayDateinMS = Date.parse(currentDate.toString()) 
    //I need today's date because that is what i use to query the orders to know if an order already exists for today
    
    const today = dayOfWeekMap[currentDate.getDay()]//this tells if today is monday or tuesday...

    const subscriptions = await Subscription.find({})

    subscriptions.forEach(async sub => {
        const {_id, plans, endDate} = sub;
        if (endDate - todayDateinMS <= 0) return //if todays date is greater than the date the subscription is supposed to end, nothing happens.
        
        for (let day in plans) {
            if (day == null) return; //if no plan is made for this day normally, nothing happens
            if (day !== today)continue // if it isn't today, skip


            const order = Order.find({subscriptionId: _id})
            order.where('deliveryTime').gt(todayDateinMS).lt(todayDateinMS+86400000)
            const result = await order
            console.log(result);

            //the above query simply finds an order that may exist in the collection. 
            //The query simpley checks if the deliveryTime in the order document falls within today. 
            //It might change in the future.

            if (result) return //if an order already exists i want to do nothing.

            //if it doesn't exist...
            const {meal, deliveryTime} = plans[day]
            //...then I want to create a new order based on details from the subscription.
            const newOrder = await Order.create({subscriptionId: _id, deliveryTime, meal, deliveryCost: 1000})
        }
    })
}


const updateInterval = setInterval(() => {
    updateOrdersList()
}, interval)


//I don't need to export anything in the file. However this file is required in the server's entry point (index.js)
//Since it has been required, everything in the file will be run automatically.

//I forgot to mention that when a user wants to change a meal for just a particular day, without changing the subscription details, that meal would simply be created as an order. This is why in the above code we check if an order already exists before creating a new one.

//So boss philip what do you think.