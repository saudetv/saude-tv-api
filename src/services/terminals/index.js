const Model = require("../../models/Terminal");
const Service = require("../service");
const errorHandler = require("../../helpers/errorHandler");
const { validate, setReturnObject } = require("../../helpers/response");
const Entity = "terminal";
const LogModel = require("../../models/Logs");
const logger = require("../../helpers/logger");
const ContentViewLog = require("../../models/ContentViewLog");

class Question extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = async (req, res) => {
    const query = req.query;
    const sort = "-createdAt";
    const pagination = req.query.pagination === "false" ? false : true;
    const options = {
      sort,
      pagination,
      page: req.query.page,
      populate: "contents",
    };

    try {
      const terminals = await Model.paginate(query, options);
      return super.index(req, res, async () => terminals);
    } catch (error) {
      console.error(error);
    }
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      console.log(`Terminal: ${req.params.id}`);
      let terminal = [];
      let query = Model.findById(req.params.id);
      if (req.query.populated) {
        query = query.populate({ path: "contents" });
      }
      terminal = await query.exec();
      const filteredContents = terminal.contents.filter((content) => {
        if (!content.finalDate) {
          return true; // inclui conteúdos sem dataFinal definida
        }
        const [day, month, year] = content.finalDate.split("/");
        const dateFinal = new Date(`${year}-${month}-${day}`);
        return dateFinal > new Date();
      });
      terminal.contents = filteredContents;
      LogModel.create({
        entity: Entity,
        route: req.originalUrl,
        agent: req.headers["user-agent"],
        response: terminal,
        method: req.method,
        id: req.params.id,
      });
      await Model.findByIdAndUpdate(req.params.id, { status: "on" }); // atualiza o status do terminal no banco de dados
      return terminal;
    });
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

  copy = async (req, res) => {
    try {
      const _id = req.params.id;
      const terminal = await Model.findById(_id)
        .lean()
        .exec(async function (error, results) {
          if (!error) {
            const object = results;
            delete object._id;
            const newTerminal = new Model(object);
            newTerminal.save();
            let result = await validate(
              newTerminal,
              Entity,
              process.env.CODE_FOUND,
              process.env.MESSAGE_FOUND
            );
            res.json(result);
          }
        });
    } catch (error) {
      var result = await errorHandler(error, Entity);
      res.status(result.statusCode).json(result);
    }
  };

  terminalsByWeek = async () => {
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

  checkTerminalHealth = async () => {
    const terminal = await Model.find({ status: "on" });
    terminal.forEach((element, index) => {
      const date = new Date(Number(element.updatedAt));

      date.setMinutes(date.getMinutes() + 10);
      if (new Date() > date) {
        terminal[index].status = "off";
        terminal[index].save();
      }
    });
  };

  getCities = async () => {
    const result = await Model.aggregate([
      {
        $match: {
          "location.city": {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          location: {
            $first: "$location.city",
          },
        },
      },
      {
        $group: {
          _id: "$location",
        },
      },
    ]);
    const cities = result.map((item) => {
      return item._id;
    });
    return cities;
  };

  getStates = async () => {
    const result = await Model.aggregate([
      {
        $match: {
          "location.state": {
            $exists: true,
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          location: {
            $first: "$location.state",
          },
        },
      },
      {
        $group: {
          _id: "$location",
        },
      },
    ]);
    const states = result.map((item) => {
      return item._id;
    });
    return states;
  };
  alive = async (req, res) => {
    try {
      const _id = req.params.id;
      const terminal = await Model.findById(_id);
      terminal.status = "on";
      terminal.appVersion = req.body.appVersion;
      if (req.body.appVersion == process.env.MOBILE_VERSION) {
        terminal.updated = true;
      } else {
        terminal.updated = false;
      }
      terminal.save();
      let result = await validate(
        terminal,
        Entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );
      logger.log("info", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: result,
        },
      });
      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, Entity);
      res.status(result.statusCode).json(result);
    }
  };

  display = async (req, res) => {
    try {
      const userId = req.user._id;

      const { id: terminalId, idContent: contentId } = req.params;

      const viewLog = new ContentViewLog({
        user: userId,
        content: contentId,
        terminal: terminalId,
      });

      let result = await validate(
        viewLog,
        Entity,
        process.env.CODE_FOUND,
        process.env.MESSAGE_FOUND
      );

      await viewLog.save();

      await Model.updateOne(
        { _id: terminalId },
        { $set: { lastViewedContent: contentId } }
      );

      logger.log("info", `Requesting ${req.method} ${req.originalUrl}`, {
        tags: "http",
        additionalInfo: {
          body: req.body,
          headers: req.headers,
          response: result,
        },
      });

      res.json(result);
    } catch (error) {
      var result = await errorHandler(error, Entity);
      res.status(result.statusCode).json(result);
    }
  };
}

module.exports = Question;
