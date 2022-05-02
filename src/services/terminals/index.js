const Model = require("../../models/Terminal");
const Service = require("../service");
const errorHandler = require("../../helpers/errorHandler")
const { validate, setReturnObject } = require("../../helpers/response");
const Entity = "terminal";

class Question extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    return Model.find(req.query).populate({ path: "playlists", populate: { path: "contents" } });
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

  copy = async (req, res) => {
    try {
      const _id = req.params.id
      const terminal = await Model.findById(_id).lean().exec(async function (error, results) {
        if (!error) {
          const object = results
          delete object._id
          console.log(object)
          const newTerminal = new Model(object)
          newTerminal.save()
          let result = await validate(
            newTerminal,
            Entity,
            process.env.CODE_FOUND,
            process.env.MESSAGE_FOUND
          );
          res.json(result);
        }
      })

    } catch (error) {
      var result = await errorHandler(error, Entity)
      res.status(result.statusCode).json(result);
    }

  };
}

module.exports = Question
