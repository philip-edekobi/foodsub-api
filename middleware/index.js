const { admin, serviceProvider } = require("./authMiddleware");

module.exports = {
    adminAuth: admin,
    serviceProviderAuth: serviceProvider,
};
