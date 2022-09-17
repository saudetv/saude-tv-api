const mongoose = require("mongoose");
const Model = mongoose.model("User");
const errorHandler = require("../../helpers/errorHandler");
const { generateToken } = require("../../helpers/jwt");

const { validate, setReturnObject } = require("../../helpers/response");

const logger = require("../../helpers/logger");

const sendUser = async (req, res) => {
  try {
    console.log(req.user);
    let result = await validate(
      req.user,
      "user",
      process.env.CODE_FOUND,
      process.env.MESSAGE_FOUND
    );
    res.json(result);
  } catch (error) {
    var result = await errorHandler(error, this.entity);
    res.status(result.statusCode).json(result);
  }
};

const login = async (req, res) => {
  const resultQuery = await Model.findOne({
    email: req.body.email,
  }).populate("customer");
  try {
    await validate(resultQuery, "user", process.env.CODE_FOUND);
    const isPasswordMatch = resultQuery.password === req.body.password;
    if (!isPasswordMatch) {
      let error = await setReturnObject(
        null,
        "user",
        null,
        "Wrong password",
        400
      );
      logger.log("error", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: error,
        },
      });
      res.status(400).json(error);
    }
    if (resultQuery.status === true) {
      const token = await generateToken(resultQuery);
      if (req.body.terminal) {
        if (!resultQuery.auth.clientToken) {
          resultQuery.auth.clientToken = token;
        }
      } else {
        resultQuery.auth.token = token;
      }
      await resultQuery.save();

      logger.log("info", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: resultQuery,
        },
      });
      res.json(await validate(resultQuery, "user", process.env.CODE_FOUND));
    } else {
      let error = await setReturnObject(
        null,
        "user",
        null,
        "Your user is inactive",
        400
      );

      logger.log("error", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: error,
        },
      });
      res.status(400).json(error);
    }
  } catch (error) {
    var result = await errorHandler(error, this.entity);

    logger.log("error", `Requesting ${req.method} ${req.originalUrl}`, {
      tags: "http",
      additionalInfo: {
        body: req.body,
        headers: req.headers,
        response: result,
        trace: error,
      },
    });
    res.status(result.statusCode).json(result);
  }
};

module.exports = {
  sendUser: sendUser,
  login: login,
};
