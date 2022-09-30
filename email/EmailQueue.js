/*const amqp = require("amqplib");

/**
 * @var {Promise<MessageBroker>}
 *

let instance;

class EmailQueue {
    // create a connection to rabbitmq

    async init() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        return this;
    }

    async send(queue, msg) {
        if (!this.connection) {
            await this.init();
        }
        await this.channel.assertQueue(queue, { durable: true });
        this.channel.sendToQueue(queue, msg);
    }
}

module.exports = EmailQueue;*/

const amqp = require("amqplib");
const path = require("path");

require("dotenv").config({
    path: path.resolve(
        __dirname,
        "..",
        `${process.env.NODE_ENV ? "" : ".dev"}.env`
    ),
});

/**
 * @var {Promise<MessageBroker>}
 */

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

/**
 *  @return { Promise<EmailQueue> } // making type inference easier
 */

module.exports = EmailQueue;
