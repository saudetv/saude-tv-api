const Model = require("../../models/User");
const mongoose = require("mongoose");
const Service = require("../service");
const Entity = "user";

class User extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res);
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      const users = await Model.findById(req.params.id).populate({
        path: "customer",
        populate: {
          path: "terminals",
          populate: { path: "contents" },
        },
      });
      return users;
    });
  };

  store = async (req, res) => {
    await super.store(req, res);
  };

  update = (req, res) => {
    super.update(req, res);
  };

  destroy = (req, res) => {
    super.destroy(req, res);
  };
}

module.exports = User;
