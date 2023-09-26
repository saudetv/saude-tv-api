const Model = require("../../../models/User");
const mongoose = require("mongoose");
const Service = require("../../service");
const Entity = "user";

class User extends Service {
  constructor() {
    super(Entity, Model);
  }
  index = async (req, res) => {
    const {
      search,
      pagination = true,
      page,
      populate: populateQuery = true,
      type,
    } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { corporateName: new RegExp(search, "i") },
        { fantasyName: new RegExp(search, "i") },
      ];
    } else if (type) {
      query.type = type;
    }

    const sort = "-createdAt";
    const options = {
      sort,
      pagination: pagination !== "false",
      page,
      populate: populateQuery == "false" ? "" : "customer",
    };

    try {
      const users = await Model.paginate(query, options);
      return super.index(req, res, async () => users);
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = User;
