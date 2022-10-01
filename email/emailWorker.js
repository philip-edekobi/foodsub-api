const amqp = require("amqplib/callback_api");
const path = require("path");

require("dotenv").config({
    path: path.resolve(
        __dirname,
        "..",
        `${process.env.NODE_ENV ? "" : ".dev"}.env`
    ),
});

const emailTransport = globalThis.queueInstance.transportObject;

const runQueue = () => {
    amqp.connect(process.env.RABBITMQ_URL, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            let queue = "email";

            channel.assertQueue(queue, {
                durable: true,
            });

            channel.prefetch(1);

            channel.consume(
                queue,
                function (msg) {
                    let jsonStr = msg.content.toString();
                    emailTransport.sendMail(JSON.parse(jsonStr));

                    setTimeout(function () {
                        channel.ack(msg);
                        console.log("Sent");
                    }, 1500);
                },
                {
                    noAck: false,
                }
            );
        });
    });
};

(function loop() {
    setTimeout(() => {
        runQueue();
        loop();
    }, 3000);
})();
