module.exports = {
    admin: async (req, res, next) => {
        const role = req.session.user.role;

        if (role === "ADMIN") {
            return next();
        }
        return res.status(403).json({
            msg: "you do not have access to this protected url endpoint",
        });
    },

    serviceProvider: async (req, res, next) => {
        const role = req.session.user.role;

        if (role === "SERVICE PROVIDER") {
            return next();
        }
        return res.status(403).json({
            msg: "you do not have access to this protected url endpoint",
        });
    },
};
