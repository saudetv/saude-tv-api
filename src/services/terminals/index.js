const Model = require("../../models/Terminal");
const PlaylistModel = require("../../models/Playlist");
const Service = require("../service");
const errorHandler = require("../../helpers/errorHandler");
const { validate, setReturnObject } = require("../../helpers/response");
const Entity = "terminal";

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
    super.show(req, res, () => {
      console.log(`Terminal: ${req.params.id}`);
      return Model.findById(req.params.id);
    });
  };

  store = (req, res) => {
    super.store(req, res, async () => {
      if (req.body.playlists) {
        req.body.playlist = []
        req.body.playlists.forEach(async (element) => {
          const playlist = await PlaylistModel.findById(element)
          playlist.contents.forEach(content => {
            console.log(content);
            if (!req.body.playlist.includes(content)) {
              req.body.playlist.push(content)
            }
          });
        });
      }
      console.log(req.body);
      return Model.create(req.body);
    });
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
}

module.exports = Question;
