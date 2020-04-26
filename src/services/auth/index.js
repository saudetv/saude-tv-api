const mongoose = require("mongoose");
const Model = mongoose.model("User");
const errorHandler = require("../../helpers/errorHandler")
const { generateToken } = require("../../helpers/jwt");

const { validate, setReturnObject } = require("../../helpers/response");

const sendUser = async (req, res) => {
    try {
        let result = await validate(
            req.user,
            'user',
            process.env.CODE_DELETED,
            process.env.MESSAGE_DELETED
        );
        res.json(result);
    } catch (error) {
        var result = await errorHandler(error, this.entity)
        res.status(result.statusCode).json(result);
    }
}

const login = async (req, res) => {
    const resultQuery = await Model.findOne({
        username: req.body.username
    });
    try {
        await validate(resultQuery, 'user', process.env.CODE_FOUND);
    } catch (error) {
        var result = await errorHandler(error, this.entity)
        res.status(result.statusCode).json(result);
    }
    const isPasswordMatch = resultQuery.password === req.body.password;
    if (!isPasswordMatch) {
        let error = await setReturnObject(
            null,
            'user',
            null,
            "Wrong password",
            400
        );
        res.status(400).json(error);
    }
    if (resultQuery.status === true) {
        const token = await generateToken(resultQuery);
        resultQuery.auth.token = token;
        await resultQuery.save();
        res.json(await validate(resultQuery, 'user', process.env.CODE_FOUND));
    } else {
        let error = await setReturnObject(
            null,
            'user',
            null,
            "Your user is inactive",
            400
        );
        res.status(400).json(error);
    }
}

module.exports = {
    sendUser: sendUser,
    login: login
}