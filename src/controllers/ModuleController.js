const mongoose = require("mongoose");

const Model = mongoose.model("Module");

const { validate } = require("../helpers/response");

const Entity = "module";

module.exports = {
  async index(req, res) {
    if (req.query.hasOwnProperty("name")) {
      req.query.name = {
        $regex: new RegExp(`.*${req.query.name}.*`, "i")
      };
    }
    const response = await Model.find(req.query);
    try {
      let result = await validate(
        response,
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

  async show(req, res) {
    try {
      let response = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        response = await Model.findById(req.params.id);
      }
      let result = await validate(
        response,
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

  async store(req, res) {
    const response = await Model.create(req.body);
    try {
      let result = await validate(
        response,
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
      let response = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        response = await Model.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true
          }
        );
      }
      let result = await validate(
        response,
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
      let response = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        response = await Model.findOneAndDelete({ _id: req.params.id });
      }
      let result = await validate(
        response,
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
