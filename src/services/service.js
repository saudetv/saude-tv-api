const mongoose = require("mongoose");
const errorHandler = require("../helpers/errorHandler")
const { validate, setReturnObject } = require("../helpers/response");

module.exports = class ServiceDefault {
  constructor(entity, model) {
    this.entity = entity;
    this.model = model
  }

  async index(req, res, callbackFunction = null) {
    try {
      if (callbackFunction) {
        var resultQuery = await callbackFunction();
      } else {
        var resultQuery = await this.model.find(req.query).populate('contents');
      }
      let result = await validate(
        resultQuery,
        this.entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }

  async store(req, res, callbackFunction = null) {
    try {
      if (callbackFunction) {
        var resultQuery = await callbackFunction();
      } else {
        var resultQuery = await this.model.create(req.body);
      }
      let result = await validate(
        resultQuery,
        this.entity,
        process.env.CODE_CREATED,
        process.env.MESSAGE_CREATED
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }


  async show(req, res, callbackFunction = null) {
    try {
      var resultQuery = null
      if (callbackFunction) {
        resultQuery = await callbackFunction();
      } else {
        if (mongoose.Types.ObjectId.isValid(req.params.id))
          resultQuery = await this.model.findById(req.params.id).populate('contents')
      }
      let result = await validate(
        resultQuery,
        this.entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }


  async update(req, res, callbackFunction = null) {
    try {
      var resultQuery = null
      if (callbackFunction) {
        resultQuery = await callbackFunction();
      } else {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          resultQuery = await this.model.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            {
              new: true
            }
          );
        }
      }
      let result = await validate(
        resultQuery,
        this.entity,
        process.env.CODE_UPDATED,
        process.env.MESSAGE_UPDATED
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }
  async destroy(req, res, callbackFunction = null) {
    try {
      var resultQuery = null
      if (callbackFunction) {
        resultQuery = await callbackFunction();
      } else {
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          resultQuery = await this.model.findOneAndDelete({ _id: req.params.id });
        }
      }
      let result = await validate(
        resultQuery,
        this.entity,
        process.env.CODE_DELETED,
        process.env.MESSAGE_DELETED
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }
  async default(req, res, data, callbackFunction = null) {
    try {
      if (callbackFunction && !data)
        data = await callbackFunction()
      let result = await validate(
        data,
        this.entity,
        process.env.CODE_CREATED,
        process.env.MESSAGE_CREATED
      );
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, this.entity)
      res.status(result.statusCode).json(result);
    }
  }
};
