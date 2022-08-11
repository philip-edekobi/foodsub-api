const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
    name: { type: String},
    email: { 
        type: String, 
        unique: true 
    },
    password: {
        type: String,
    },
    phoneNumber: { 
        type: String, 
        required: true,
        unique: true,
    }
}, {timestamps: true});

UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

const User = model("User", UserSchema);

module.exports = User;