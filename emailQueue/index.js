const amqp = require("amqplib");

/**
 * @var {Promise<MessageBroker>}
 */

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

/**
 *  @return { Promise<EmailQueue> } // making type inference easier
 */
EmailQueue.getInstance = async function () {
    if (!instance) {
        const queue = new EmailQueue();
        instance = queue.init();
    }
    return instance;
};

module.exports = EmailQueue;
