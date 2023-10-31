const logger = require("../../../helpers/logger");
const Model = require("../../../models/Customer");
const TerminalModel = require("../../../models/Terminal");
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

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;

      const contracts = company.contracts.slice(startIndex, endIndex);

      // Populate company for each contract
      for (let contract of contracts) {
        contract.company = await Model.findById(contract.company);
      }

      // Formulate the response similar to mongoose-paginate-v2
      const response = {
        docs: contracts,
        totalDocs: company.contracts.length,
        limit: limit,
        totalPages: Math.ceil(company.contracts.length / limit),
        page: page,
        pagingCounter: startIndex + 1,
        hasPrevPage: page > 1,
        hasNextPage: endIndex < company.contracts.length,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: endIndex < company.contracts.length ? page + 1 : null,
      };

      res.json(response);
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
            populate: { path: "lastViewedContent" },
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

  addTerminal = async (req, res) => {
    const { id } = req.params;
    const company = await Model.findById(id);

    const terminal = await TerminalModel.create(req.body);

    company.terminals.push(terminal._id);
    company.save();

    res.json(company);
  };

  addSubscriber = async (req, res) => {
    const { id } = req.params;
    const myCompany = await Model.findById(id);

    const subscribers = await Model.create(req.body);

    myCompany.subscribers.push(subscribers._id);
    myCompany.save();

    res.json(myCompany);
  };

  allContracts = async (req, res) => {
    try {
      // Consulta para buscar todos os contratos de todos os clientes
      const allContracts = await Model.aggregate([
        {
          $unwind: "$contracts",
        },
        {
          $project: {
            _id: 0,
            company: "$_id", // Mapeie o campo _id para a propriedade "company"
            contract: "$contracts",
          },
        },
      ]);
  
      // Formular a resposta
      const response = {
        docs: allContracts,
        totalDocs: allContracts.length,
      };
  
      res.json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  };
  

}



module.exports = Company;
