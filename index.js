const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require("./routes");
const mongoose = require('mongoose');
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);


( async () => {
    try {
        require("dotenv").config();
        const PORT = process.env.PORT || 5000;

        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true });

        const app = express();

        app.disable('x-powered-by');

        app.use(cors({
            preflightContinue: false,
            origin: "*",
            optionsSuccessStatus: 204
        }));
        
        app.use(express.urlencoded({ extended: true }));
        app.use(express.json());
        app.use(cookieParser());

        app.set('trust proxy', 1)
        app.use(session({
            name: process.env.SESS_NAME,
            secret: process.env.SESS_SECRET,
            saveUninitialized: false,
            resave: false,
            store: new MongoStore({
                collection: 'session',
                uri: process.env.MONGO_URL
            }),
            cookie: {
                sameSite: 'none',
                secure: !!(process.env.NODE_ENV === 'production'),
                maxAge: parseInt(process.env.SESS_LIFETIME)
            }
        }));

        app.use("/api/user/", routes.userRoutes);
        app.use("/api/session/", routes.sessionRoutes);
        app.use("/api/sms/", routes.verifyRoutes);

        const server = require("http").createServer(app);

        server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
    } catch(err) {
        console.log(err);
    }
})();