require("dotenv").config();
const bcrypt = require("bcrypt");
const fs = require("fs/promises");
const path = require("path");

/*const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);*/

const parseError = err => {
    if (err.isJoi) return err.details[0];
    return { error: err.message };
};
const sessionizeUser = (user, role) => {
    return { id: user.id, name: user.name, role: role ?? undefined };
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
        .then(message => (messageResp = message.sid))
        .catch(err => console.error(parseError(err)));
    return messageResp;
};

const hash = password => bcrypt.hashSync(password, 12);

const compare = (password, hashVal) => bcrypt.compareSync(password, hashVal);

const log = async error => {
    const msg = `
    [${new Date().toISOString()}] --- ${error.message}

    ${error.stack ? error.stack : ""}


    `;

    const dir = `${__dirname}${path.sep}..${path.sep}logs${path.sep}error-logs.txt`;

    await fs.appendFile(dir, msg);
};

module.exports = {
    parseError,
    sessionizeUser,
    sendSms,
    hash,
    compare,
    log,
};
