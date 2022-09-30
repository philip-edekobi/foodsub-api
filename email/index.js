const nodemailer = require("nodemailer");
const EmailQueue = require("./EmailQueue");

const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    pool: true,
    maxConnections: 1,
    port: 2525,
    auth: {
        user: "1ede8f438ed839",
        pass: "aea8d35920c762",
    },
});

const queue = new EmailQueue(transport);

(async () => await queue.init())();

globalThis.queueInstance = queue;
