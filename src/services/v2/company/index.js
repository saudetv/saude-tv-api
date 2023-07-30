const logger = require("../../../helpers/logger");
const Model = require("../../../models/Customer");
const Service = require("../../service");
const Entity = "customer";

class Company extends Service {
  constructor() {
    super(Entity, Model);
  }

  my = async (req, res) => {
    try {
      if (!req.user || !req.user.customer || !req.user.customer._id) {
        return res.status(400).json({ message: "Invalid request" });
      }

      const query = { _id: req.user.customer._id };
      const sort = "-createdAt";
      const pagination = req.query.pagination === "false" ? false : true;
      const options = {
        sort,
        pagination,
        page: req.query.page,
        populate: [
          {
            path: "terminals",
            populate: {
              path: "contents",
            },
          },
          {
            path: "subscribers",
            populate: {
              path: "terminals",
            },
          },
        ],
      };

      const customer = await Model.paginate(query, options);

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

      const company = await Model.findById(customer._id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const query = { _id: { $in: company.subscribers } };
      const sort = "-createdAt";
      const pagination = req.query.pagination === "false" ? false : true;
      const options = {
        sort,
        pagination,
        page: req.query.page,
        populate: [
          {
            path: "terminals",
            populate: { path: "contents" },
          },
        ],
      };

      const result = await Model.paginate(query, options);

      return super.index(req, res, async () => result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  addContract = async (req, res) => {
    try {
      console.info("addContract");
      const { customer } = req.user;

      const company = await Model.findById(customer._id);

      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }

      const newContract = req.body;
      company.contracts.push(newContract);
      await company.save();
      res.json(company);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
}

module.exports = Company;
