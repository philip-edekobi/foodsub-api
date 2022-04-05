const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require("./routes");
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongo");

( async () => {
    try {
        require("dotenv").config();
        const PORT = process.env.PORT || 5000;

        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

        const app = express();

        app.disable('x-powered-by');

        app.use(cors({
            preflightContinue: true,
            origin: "*"
        }));

        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());
        app.use(session({
            name: process.env.SESS_NAME,
            secret: process.env.SESS_SECRET,
            saveUninitialized: false,
            resave: false,
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                collection: 'session',
                ttl: parseInt(process.env.SESS_LIFETIME) / 1000,
            }),
            cookie: {
                sameSite: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: parseInt(process.env.SESS_LIFETIME)
            }
        }));

        app.use("/api/user/", routes.userRoutes);
        app.use("/api/session/", routes.sessionRoutes);

        const server = require("http").createServer(app);

        server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
    } catch(err) {
        console.log(err);
    }
})();