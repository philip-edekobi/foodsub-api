const { Router } = require("express");
const Admin = require("../models/Admin");
const { signUp, signIn } = require("../validations/userValidations");
const { parseError, hash, sessionizeUser, compare } = require("../utils");
const { adminAuth } = require("../middleware");

const adminRoutes = Router();

/* @route POST /api/v1/admin/
 * Create Admin
 */
adminRoutes.post("/", async (req, res) => {
    const { name, email, password } = req.body;
    try {
        signUp.validate({ name, email });
        const existingAdmin = await Admin.findOne({ name, email });

        if (existingAdmin) {
            return res.status(409).json({ err: "admin already exists" });
        }

        const admin = new Admin({
            name,
            email,
            password: hash(password),
        });

        await admin.save();

        const sessionUser = sessionizeUser(admin, "ADMIN");
        req.session.user = sessionUser;
        req.session.save();
        res.status(201).send(sessionUser);
    } catch (error) {
        res.status(500).send(parseError(error));
    }
});

/* @route POST /api/v1/admin/login
 * Log In as Admin
 */
adminRoutes.post(
    "/login",
    async ({ session, body: { email, password } }, res) => {
        try {
            if (!(email && password)) {
                return res
                    .status(400)
                    .json({ err: "email or password missing" });
            }

            signIn.validate({ email });

            const admin = await Admin.findOne({ email });

            if (!admin) {
                return res.status(404).json({ err: "admin does not exist" });
            }

            if (!compare(password, admin.password)) {
                return res.status(400).json({ err: "Incorrect password" });
            }

            session.user = sessionizeUser(admin, "ADMIN");
            session.save();
            return res.status(200).send("login successful");
        } catch (error) {
            return res.status(500).send(parseError(error));
        }
    }
);

/* @route PATCH /api/v1/user
 * Edit admin details
 */
adminRoutes.patch("/", adminAuth, async ({ body, admin }, res) => {
    try {
        const currentAdmin = await Admin.findById(admin.id);
        if (currentAdmin) {
            for (let property in body) {
                if (property in currentAdmin) {
                    if (property === "password") {
                        continue;
                    }
                    currentAdmin[property] = body[property];
                }
            }
            currentAdmin.password = body.password
                ? hash(body.password)
                : currentAdmin.password;
        } else {
            return res.status(404).json({ err: "admin does not exist" });
        }
        await currentAdmin.save();
        res.status(206).json({ msg: "operation successful" });
    } catch (err) {
        res.status(500).send(parseError(err));
    }
});

/* @route DELETE /api/v1/admin/
 * Delete Admin
 */
adminRoutes.delete("", adminAuth, async (req, res) => {
    try {
        const currentAdmin = await Admin.findById(req.admin.id);
        if (currentAdmin) {
            await Admin.findByIdAndDelete(req.admin.id);
            res.status(200).send("success!");
        } else {
            return res.status(404).json({ err: "admin does not exist" });
        }
    } catch (error) {
        res.status(500).send(parseError(err));
    }
});

module.exports = adminRoutes;
