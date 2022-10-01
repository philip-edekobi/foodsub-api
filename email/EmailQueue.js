const amqp = require("amqplib");
const path = require("path");

require("dotenv").config({
    path: path.resolve(
        __dirname,
        "..",
        `${process.env.NODE_ENV ? "" : ".dev"}.env`
    ),
});

class EmailQueue {
    constructor(transport) {
        this.transportObject = transport;
        this.queue = "email";
    }

    async init() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();

        this.channel.assertQueue(this.queue, {
            durable: true,
        });

        return this;
    }

    async addMail(mailOpts) {
        let msg = Buffer.from(JSON.stringify(mailOpts));
        this.channel.sendToQueue(this.queue, msg, {
            persistent: true,
        });
    }
}

module.exports = EmailQueue;
