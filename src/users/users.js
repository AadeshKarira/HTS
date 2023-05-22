const express = require('express');
const router = express.Router();
const users = require("../../models/users");
const bcrypt = require('bcrypt');
const password_check = require("../../services/password_check");
const logger = require('../../config/logger');
const saltRounds = 10;

router.post('/sign-up', async (req, res) => {
    try {
        const password_check_result = await password_check.checkPassword(req.body.password);
        if (password_check_result) {
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
            const get = await users.insertOne(req.body);
            if (get.err) {
                throw new Error(get.err);
            }
            if (get._id) {
                return res.status(200).send({status: true, statusCode: 200, message: "created successfully", data: {first_name: get.first_name, last_name: get.last_name, email: get.email}});
            } else {
                return res.status(403).send({status: false, statusCode: 403, message: "failed to create.", err: get});
            }
        } else {
            return res.status(400).send({status: false, statusCode: 400, message: "password must be 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character."});
        }
    } catch (err) {
        logger.logEvents("Error", err.stack);
        return res.status(400).send({status: false, statusCode: 400, message: err.message})
    }
});

router.post('/sign-in', async (req, res) => {
    try {
            const get_user = await users.findOne({email: req.body.email});
            if (get_user.err) {
                throw new Error(get_user.err);
            }
            if (get_user._id) {
                const match = await bcrypt.compare(req.body.password, get_user.password);
                if (match) {
                    return res.status(200).send({status: true, statusCode: 200, message: "logged in successfully", data: {first_name: get_user.first_name, last_name: get_user.last_name, email: get_user.email}});
                } else {
                    return res.status(403).send({status: false, statusCode: 403, message: "failed to login.", err: "invalid password"});
                }
            } else {
                return res.status(403).send({status: false, statusCode: 403, message: "failed to login.", err: "invalid email"});
            }
    } catch (err) {
        logger.logEvents("Error", err.stack);
        return res.status(400).send({status: false, statusCode: 400, message: err.message})
    }
});

module.exports = router;