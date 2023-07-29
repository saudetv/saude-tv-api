const Model = require("../../../models/Customer");
const Service = require("../../service");
const Entity = "customer";

class Company extends Service {
  constructor() {
    super(Entity, Model);
  }

  my = async (req, res) => {
    try {
      console.log(req.user);

      if (!req.user || !req.user.customer || !req.user.customer._id) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const customer = await Model.findById(req.user.customer._id)
        .populate({
          path: "terminals",
          populate: {
            path: "contents",
          },
        })
        .populate({ path: "subscribers", populate: { path: "terminals" } });

      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      res.json(customer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  myContracts = async (req, res) => {
    try {
      const { customer } = req.user;

      const company = await Model.findById(customer._id).select("contracts");

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(company.contracts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };

  mySubscribers = async (req, res) => {
    try {
      const { customer } = req.user;

      const company = await Model.findById(customer._id).populate({
        path: "subscribers",
        populate: {
          path: "terminals",
          populate: { path: "contents" },
        },
      });

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      res.json(company.subscribers);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = Company;
