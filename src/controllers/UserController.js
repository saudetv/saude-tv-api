const mongoose = require("mongoose");

const Model = mongoose.model("User");

const Module = mongoose.model("Module");

const { generateToken } = require("../helpers/jwt");

const { validate, setReturnObject } = require("../helpers/response");

const Entity = "user";

module.exports = {
  async login(req, res) {
    const resultQuery = await Model.findOne({
      username: req.body.username
    }).populate({
      path: "profile",
      populate: {
        path: "profileModule.module"
      }
    });
    try {
      await validate(resultQuery, Entity, process.env.CODE_FOUND);
    } catch (error) {
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
    const isPasswordMatch = resultQuery.password === req.body.password;
    if (!isPasswordMatch) {
      let error = await setReturnObject(
        null,
        Entity,
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
      res.json(await validate(resultQuery, Entity, process.env.CODE_FOUND));
    } else {
      let error = await setReturnObject(
        null,
        Entity,
        null,
        "Your user is inactive",
        400
      );
      res.status(400).json(error);
    }
  },

  async index(req, res) {
    if (req.query.hasOwnProperty("name")) {
      req.query.name = {
        $regex: new RegExp(`.*${req.query.name}.*`, "i")
      };
    }
    if (req.query.hasOwnProperty("token")) {
      req.query.auth = { token: req.query.token };
      delete req.query.token;
    }

    const resultQuery = await Model.find(req.query).populate({
      path: "profile",
      populate: {
        path: "profileModule.module"
      }
    });
    try {
      let result = await validate(
        resultQuery,
        Entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );
      if (req.query.hasOwnProperty("auth")) result.data = result.data[0];

      res.json(result);
    } catch (error) {
      console.log(error);
      
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  },

  async show(req, res) {
    try {
      let resultQuery = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        resultQuery = await Model.findById(req.params.id);
      }
      let result = await validate(
        resultQuery,
        Entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );
      res.json(result);
    } catch (error) {
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  },

  async checkAuth(req, res) {
    if (req.query.hasOwnProperty("token")) {
      req.query.auth = { token: req.query.token };
      delete req.query.token;
      try {
        let resultQuery = null;
        resultQuery = await Model.findOne(req.query).populate({
          path: "profile",
          populate: {
            path: "profileModule.module"
          }
        });
        let result = await validate(
          resultQuery,
          Entity,
          process.env.CODE_FOUND,
          process.env.MESSAGE_FOUND
        );
        res.json(result);
      } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
      }
    } else {
      let error = await setReturnObject(
        null,
        Entity,
        null,
        "Please send correct params",
        406
      );
      res.status(406).json(error);
    }
  },

  async store(req, res) {
    const resultQuery = await Model.create(req.body);
    try {
      let result = await validate(
        resultQuery,
        Entity,
        process.env.CODE_CREATED,
        process.env.MESSAGE_CREATED
      );
      res.json(result);
    } catch (error) {
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  },
  async update(req, res) {
    try {
      let resultQuery = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        resultQuery = await Model.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true
          }
        );
      }
      let result = await validate(
        resultQuery,
        Entity,
        process.env.CODE_UPDATED,
        process.env.MESSAGE_UPDATED
      );
      res.json(result);
    } catch (error) {
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  },

  async destroy(req, res) {
    try {
      let resultQuery = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        resultQuery = await Model.findOneAndDelete({ _id: req.params.id });
      }
      let result = await validate(
        resultQuery,
        Entity,
        process.env.CODE_DELETED,
        process.env.MESSAGE_DELETED
      );
      res.json(result);
    } catch (error) {
      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  }
};
