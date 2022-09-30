require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");

/*const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);*/

const parseError = (err) => {
    if (err.isJoi) return err.details[0];
    return { error: err.message };
};
const sessionizeUser = (user, role) => {
    return { id: user.id, name: user.name, role: role ?? undefined };
};

const hash = (password) => bcrypt.hashSync(password, 12);

const compare = (password, hashVal) => bcrypt.compareSync(password, hashVal);

const generateCode = (length) => {
    let pin = (Math.floor(Math.random() * 1_000_000) + 999_999).toString();
    pin = pin.length !== 6 ? (pin = pin.slice(1)) : pin;

    return length === 4 ? pin.slice(2) : pin;
};

const log = async (error) => {
    const msg = `
    [${new Date().toISOString()}] --- ${error.message}
    
    ${error.stack ? error.stack : ""}
    
    
    `;

    const dir = `${__dirname}${path.sep}..${path.sep}logs${path.sep}error-logs.txt`;

    await fs.appendFile(dir, msg);
};

const sendSms = async (number, pin) => {
    const text = `Dear customer, your verification pin is ${pin}.`;

    let messageResp;
    client.messages
        .create({
            body: text,
            from: "+19032736263",
            to: number,
        })
        .then((message) => (messageResp = message.sid))
        .catch((err) => console.error(parseError(err)));
    return messageResp;
};

const sendMail = async (email, pin) => {
    const mailObj = {
        from: "foodsubscribtionforafrica@gmail.com",
        to: email,
        subject: "Verify your account",
        text: `Dear new customer, your pin is ${pin}`,
    };
    await globalThis.queueInstance.addMail(mailObj);
    console.log(`sent email is ${email} and pin is ${pin}`);
};

module.exports = {
    parseError,
    sessionizeUser,
    sendSms,
    hash,
    compare,
    log,
    sendMail,
    generateCode,
};
