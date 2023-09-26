const jwt = require("jsonwebtoken");

const mongoose = require("mongoose");

const { setReturnObject } = require("../helpers/response");

const User = mongoose.model("User");

const logger = require("../helpers/logger");

const auth = async (req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    if (req.get("Authorization")) {
      const token = req.header("Authorization").replace("Bearer ", "");
      try {
        const data = jwt.verify(token, process.env.JWT_KEY);
        let user = await User.findOne({
          _id: data._id,
          "auth.token": token,
        })
        .populate({
          path: 'customer',
          populate: {
            path: 'contracts.company',
            select: 'fantasyName'
          }
        })
          .exec();
        if (!user) {
          user = await User.findOne({
            _id: data._id,
            "auth.clientToken": token,
          }).exec();
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

        logger.log("error", `Requesting ${req.method} ${req.originalUrl}`, {
          tags: "http",
          additionalInfo: {
            body: req.body,
            headers: req.headers,
            response: e,
            trace: error,
          },
        });
        res.status(error.statusCode).json(e);
      }
    } else {
      const error = await setReturnObject(
        null,
        "User",
        process.env.CODE_NOT_AUTHORIZED,
        "Token não enviado",
        401
      );

      logger.log("error", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: error,
        },
      });
      res.status(error.statusCode).json(error);
    }
  } else {
    next();
  }
};
module.exports = auth;
