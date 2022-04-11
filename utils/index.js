const axios = require("axios");

const { SMS_URL, SMS_API_KEY } = process.env;

const parseError = err => {
    if (err.isJoi) return err.details[0];
    return {error: err.message};
};
const sessionizeUser = user => {
    return { userId: user.id, name: user.name };
}  

const sendSms = async (number, pin) => {
    const message = `Dear customer, your verification pin is ${pin}.`;
    const url = SMS_URL += `?action=send-sms&api_key=${SMS_API_KEY}&to=${number}&from=FoodSub&sms=${message}`;
    const response = await axios.post(url);

    const data =  await response.data;
    return data;
}

module.exports = {
    parseError,
    sessionizeUser,
    sendSms
}