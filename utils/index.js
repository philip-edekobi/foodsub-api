require("dotenv").config();

const axios = require("axios");
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const parseError = err => {
    if (err.isJoi) return err.details[0];
    return {error: err.message};
};
const sessionizeUser = user => {
    return { userId: user.id, name: user.name };
}  

const sendSms = async (number, pin) => {
    const text = `Dear customer, your verification pin is ${pin}.`;

    let messageResp;
    client.messages
        .create({
            body: text,
            from: '+19032736263',
            to: number
        })
        .then(message => messageResp = message.sid)
        .catch(err => console.error(parseError(err)));
    return messageResp;
}

module.exports = {
    parseError,
    sessionizeUser,
    sendSms,
}