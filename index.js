/* eslint-disable no-undef */
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const { log } = require("./utils");
require("./tasks/async-tasks");

require("dotenv").config({
    path: path.resolve(__dirname, `${process.env.NODE_ENV ? "" : ".dev"}.env`),
});

(async () => {
    try {
        const PORT = process.env.PORT || 5000;
        let connection;

        connection = mongoose.connect(process.env.MONGODB_ATLAS, {
            useNewUrlParser: true,
        });
        await connection.catch((err) => {
            throw err;
        });
        console.log("db connection successful");

        let store = new MongoStore({
            uri: process.env.MONGODB_ATLAS,
            collection: "sessions",
        });

        store.on("error", (err) => {
            throw err;
        });

        const app = express();

        app.disable("x-powered-by");

        app.use(
            cors({
                origin: ["http://localhost:3000", "http://127.0.0.1"],
                credentials: true,
            })
        );

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());

        app.set("trust proxy", 1);
        app.use(
            session({
                name: process.env.SESS_NAME,
                secret: process.env.SESS_SECRET,
                saveUninitialized: false,
                resave: false,
                store: store,
                rolling: true,
                /* the rolling property is used to make the cookie reset on every request.
                 * i.e: instead of expiring after 2 hours, if a request is made after 1 hour,
                 * the cookie expiry is now reset to 2 hours later instead of the remaining 1 hour
                 */
                cookie: {
                    sameSite: "none",
                    secure: !!(process.env.NODE_ENV === "production"),
                    maxAge: parseInt(process.env.SESS_LIFETIME),
                },
            })
        );

        app.use("/api/v1/user/", routes.userRoutes);
        app.use("/api/v1/session/", routes.sessionRoutes);
        app.use("/api/v1/sms/", routes.verifyRoutes);
        app.use("/api/v1/admin/", routes.adminRoutes);
        app.use("/api/v1/meal", routes.mealRoutes);
        app.use("/api/v1/subscription/", routes.subscriptionRoutes);
        app.use("/api/v1/orders/", routes.orderRoutes);
        app.use("/api/v1/email", routes.emailRoutes);

        const server = require("http").createServer(app);

        server.listen(PORT, () =>
            console.log(`server is running on port: ${PORT}`)
        );
    } catch (err) {
        await log(err);
        console.log(
            "Server crashed... Check log/error-logs.txt for more details"
        );
        process.exit(1);
    }
})();
