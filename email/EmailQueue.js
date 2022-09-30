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

require("dotenv").config();

/**
 * @var {Promise<MessageBroker>}
 */

let instance;

class EmailQueue {
    constructor(transport) {
        this.transportObject = transport;
    }

    async init() {
        this.connection = await amqp.connect(process.env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();
        return this;
    }

    async addMail(mailOpts) {}
}

/**
 *  @return { Promise<EmailQueue> } // making type inference easier
 */

EmailQueue.getInstance = async function () {
    if (!(typeof instance !== EmailQueue)) {
        const queue = new EmailQueue();
        instance = queue.init();
        console.log("lmao");
    }
    return instance;
};

module.exports = EmailQueue;
