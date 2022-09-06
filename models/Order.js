const { Schema, model } = require("mongoose");
const orderSchema = new Schema({
  hasExpired: { type: Boolean },
})

const Order = model(orderSchema);

module.exports = Order;
