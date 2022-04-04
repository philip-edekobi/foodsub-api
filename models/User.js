const { Schema, model } = require("mongoose");
const { compareSync, hashSync } = require("bcryptjs");

const UserSchema = new Schema({
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true,
        validate: {
            validator: email => User.doesNotExist({ email }),
            message: "Email already exists"
        } 
    },
    phoneNumber: { 
        type: String, 
        required: true,
        validate: {
            validator: number => User.doesNotExist({ phoneNumber: number }),
            message: "Number already exists"
        } 
    },
    password: { 
        type: String, 
        required: true 
    },
}, {timestamps: true});

UserSchema.pre('save', function () {
    if (this.isModified('password')) {
        this.password = hashSync(this.password, 10);
    }
});

UserSchema.statics.doesNotExist = async function (field) {
    return await this.where(field).countDocuments() === 0;
};

UserSchema.methods.comparePasswords = function (password) {
    return compareSync(password, this.password);
};

const User = model(UserSchema);

module.exports = User;