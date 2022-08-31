module.exports = {
    admin: async (req, res, next) => {
        const { user } = req.session;

        if (user && user.role === "ADMIN") {
            req.admin = user;
            return next();
        }
        return res.status(401).json({
            err: "you do not have access to this url endpoint",
        });
    },

    serviceProvider: async (req, res, next) => {
        const { user } = req.session;

        if (user && user.role === "SERVICE PROVIDER") {
            req.serviceProvider = user;
            return next();
        }
        return res.status(401).json({
            err: "you do not have access to this url endpoint",
        });
    },
};
