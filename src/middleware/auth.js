const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const { setReturnObject } = require("../helpers/response");

const User = mongoose.model("User");

const auth = async (req, res, next) => {
    if (req.get("Authorization")) {
        const token = req.header("Authorization").replace("Bearer ", "");
        try {
            const data = jwt.verify(token, process.env.JWT_KEY);
            const user = await User.findOne({
                _id: data._id,
                "auth.token": token
            }).exec();
            if (!user) {
                throw new Error();
            }
            req.user = user;
            req.token = token;
            next();
        } catch (e) {
            const error = await setReturnObject(
                null,
                "User",
                process.env.CODE_NOT_AUTHORIZED,
                process.env.MESSAGE_NOT_AUTHORIZED,
                401
            );
            res.status(error.statusCode).json(error);
        }
    } else {
        const error = await setReturnObject(
            null,
            "User",
            process.env.CODE_NOT_AUTHORIZED,
            process.env.MESSAGE_NO_TOKEN_PROVIDED,
            401
        );
        res.status(error.statusCode).json(error);
    }
};
module.exports = auth;
