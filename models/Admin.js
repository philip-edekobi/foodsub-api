const { Schema, model } = require("mongoose");

const adminSchema = new Schema({
    name: {
        type: String,
        required: true,
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
    actions: {
        type: [String],
        date: Date.now()
    },
});

const Admin = model("Admin", adminSchema);

module.exports = Admin;
