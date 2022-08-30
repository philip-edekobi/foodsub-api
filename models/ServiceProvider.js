const { Schema, model } = require("mongoose");

const spSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: Number,
        unique: true,
    },
    designation: {
        type: String,
        unique: true,
    },
    profilePic: {
        type: Schema.Types.Buffer,
    },
});

const ServiceProvider = model("ServiceProvider", spSchema);

module.exports = ServiceProvider;
