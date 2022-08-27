const auth = require("./authMiddleware");

module.exports = {
    adminAuth: auth.admin,
    spAuth: auth.serviceProvider,
};
