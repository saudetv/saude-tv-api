const mongoose = require("mongoose");

const Model = mongoose.model("Departament");
const Queue = mongoose.model("Queue");
const User = mongoose.model("User");

const { validate } = require("../helpers/response");

const Entity = "departament";

module.exports = {
  async index(req, res) {
    if (req.query.hasOwnProperty("name")) {
      req.query.name = {
        $regex: new RegExp(`.*${req.query.name}.*`, "i")
      };
    }
    const departaments = await Model.find(req.query)
      .populate("queue")
      .populate("owners");
    try {
      let result = await validate(
        departaments,
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
      let departament = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        departament = await Model.findById(req.params.id);
      }
      let result = await validate(
        departament,
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
    const departaments = await Model.create(req.body);
    try {
      let result = await validate(
        departaments,
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

  async storeQueue(req, res) {
    try {
      let departament = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        departament = await Model.findById(req.params.id);
      }
      let result = await validate(
        departament,
        Entity,
        process.env.CODE_CREATED,
        process.env.MESSAGE_CREATED
      );
      let queue = await Queue.create(req.body);
      if (mongoose.Types.ObjectId.isValid(queue._id)) {
        queue = await Queue.findById(queue._id);
      }
      await validate(queue, "queue");
      departament.queue.push(queue);
      await departament.save();
      queue.departament = departament;
      await queue.save();
      res.json(result);
    } catch (error) {
      console.log(error);

      let result = JSON.parse(error.message);
      res.status(result.statusCode).json(result);
    }
  },

  async storeOwner(req, res) {
    if (req.body.ownerId) {
      try {
        let departament = null;
        let owner = null;
        if (mongoose.Types.ObjectId.isValid(req.params.id)) {
          departament = await Model.findById(req.params.id);
        }
        if (mongoose.Types.ObjectId.isValid(req.body.ownerId)) {
          owner = await User.findById(req.body.ownerId);
        }
        let result = await validate(departament, Entity);
        await validate(owner, "owner");

        departament.owners.push(owner);
        owner.departaments.push(departament);
        await departament.save();
        await owner.save();
        res.json(result);
      } catch (error) {
        let result = JSON.parse(error.message);
        res.status(result.statusCode).json(result);
      }
    }
  },

  async update(req, res) {
    try {
      let departament = null;
      if (mongoose.Types.ObjectId.isValid(req.params.id)) {
        departament = await Model.findOneAndUpdate(
          { _id: req.params.id },
          req.body,
          {
            new: true
          }
        );
      }
      let result = await validate(
        departament,
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
