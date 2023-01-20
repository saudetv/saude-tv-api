const Model = require("../../models/Terminal");
const Service = require("../service");
const errorHandler = require("../../helpers/errorHandler");
const { validate, setReturnObject } = require("../../helpers/response");
const Entity = "terminal";
const LogModel = require("../../models/Logs");
const { log } = require("winston");

class Question extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res, () => {
      return Model.find(req.query).sort([["createdAt", -1]]);
    });
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      console.log(`Terminal: ${req.params.id}`);
      let terminal = [];
      if (req.query.populated) {
        terminal = await Model.findById(req.params.id).populate({
          path: "contents",
        });
      } else {
        terminal = await Model.findById(req.params.id);
      }
      LogModel.create({
        entity: Entity,
        route: req.originalUrl,
        agent: req.headers["user-agent"],
        response: terminal,
        method: req.method,
        id: req.params.id,
      });
      terminal.status = "on";
      terminal.save();

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
            console.log(object);
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
      console.log(new Date(), date);
      if (new Date() > date) {
        terminal[index].status = "off";
        terminal[index].save();
      }
    });
  };

  getCities = async () => {
    const result = await Model.aggregate(
      [
        {
          "$match": {
            "location.city": {
              "$exists": true
            }
          }
        },
        {
          "$group": {
            "_id": "$_id",
            "location": {
              "$first": "$location.city"
            }
          }
        },
        {
          "$group": {
            "_id": "$location",
          }
        }
      ],
    );
    return result;
  };
}

module.exports = Question;
