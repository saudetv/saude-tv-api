const Model = require("../../models/Customer");
const Service = require("../service");
const Entity = "customer";
const axios = require("axios");

class Customer extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res);
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
