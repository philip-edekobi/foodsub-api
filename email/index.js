const nodemailer = require("nodemailer");
const EmailQueue = require("./EmailQueue");

const transport = nodemailer.createTransport({
    //host: "smtp.mailtrap.io",
    //port: 2525,
    service: "gmail",
    pool: true,
    maxConnections: 1,
    auth: {
        user: "poronatedpikin@gmail.com", //"1ede8f438ed839",
        pass: process.env.ORG_SMTP_PASSWORD, //"aea8d35920c762",
    },
});

const queue = new EmailQueue(transport);

(async () => await queue.init())();

globalThis.queueInstance = queue;
