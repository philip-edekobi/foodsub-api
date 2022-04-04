const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require("./routes");
const mongoose = require('mongoose');

( async () => {
    try {
        require("dotenv").config();
        const PORT = process.env.PORT ||5000;

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

        app.use("/api/user/", routes.userRoutes);

        const server = require("http").createServer(app);

        server.listen(PORT, () => console.log(`server is running on port: ${PORT}`));
    } catch(err) {
        console.log(err);
    }
})();