const Model = require("../../models/Customer");
const Service = require("../service");
const Entity = "customer";
const axios = require("axios");

class Customer extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = async (req, res) => {
    const {
      search,
      pagination = true,
      page,
      populate: populateQuery = true,
    } = req.query;

    let query = {};
    if (search) {
      query.$or = [
        { corporateName: new RegExp(search, "i") },
        { fantasyName: new RegExp(search, "i") },
      ];
    }

    const sort = "-createdAt";
    const options = {
      sort,
      pagination: pagination !== "false",
      page,
      populate: [
        { path: "terminals", populate: { path: "lastViewedContent" } },
      ],
    };

    try {
      const customers = await Model.paginate(query, options);
      return super.index(req, res, async () => customers);
    } catch (error) {
      console.error(error);
    }
  };

  show = (req, res) => {
    super.show(req, res);
  };

  store = (req, res) => {
    super.store(req, res);
  };

  update = (req, res) => {
    super.update(req, res);
  };

  destroy = (req, res) => {
    super.destroy(req, res);
  };

  getAddressByCep = async (req, res) => {
    try {
      const address = await axios.get(
        `http://viacep.com.br/ws/${req.params.cep}/json/`
      );
      res.status(200).json(address.data);
    } catch (error) {
      res.status(404).json({ error: "Não encontrado." });
    }
  };

  customersByWeek = async () => {
    const result = await Model.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            week: { $week: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.week": -1 } },
    ]);

    return result;
  };
}

module.exports = Customer;
