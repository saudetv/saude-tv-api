const Model = require("../../models/Terminal");
const ContentModel = require("../../models/Content");
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
    const {
      search,
      pagination = true,
      page,
      populate: populateQuery = true,
      state,
    } = req.query;

    let query = {};
    if (search) {
      if (!isNaN(req.query.searchValue)) {
        query._id = req.query.searchValue;
      } else {
        query.name = new RegExp(search, "i"); // ou outro campo correspondente
      }
    } else if (state) {
      query["location.state"] = state;
    }

    const sort = "-createdAt";
    const populate = populateQuery == "false" ? "" : "contents";
    const options = {
      sort,
      pagination: pagination !== "false",
      page,
      populate,
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
      let auxTerminal = [];
      let query = Model.findById(req.params.id);
      query = query
        .populate({ path: "contents" })
        .populate({ path: "playlists", populate: { path: "contents" } })
        .populate({
          path: "playlists",
          populate: {
            path: "subPlaylist",
            populate: { path: "contents.content" },
          },
        });
      let terminal = await query.exec();
      let terminalContentsId = [];

      terminalContentsId.push(...terminal.contents.map((c) => c._id));

      if (terminal?.playlists) {
        for (const element of terminal.playlists) {
          terminal.contents.push(...element.contents);
        }

        // Agora, intercala os conteúdos da subplaylist
        let contentCounter = 0;
        let newContents = [];

        for (const content of terminal.contents) {
          if (terminalContentsId.includes(content._id)) {
            newContents.push({ ...content.toObject(), isPlaylistContent: false, isSubplaylistContent: false });
          } else {
            newContents.push({
              ...content.toObject(),
              isPlaylistContent: true,
              isSubplaylistContent: false,
            });
          }
          contentCounter++;

          for (const element of terminal.playlists) {
            if (element.subPlaylist) {
              for (const subplaylist of element.subPlaylist) {
                // Verifica se atingiu a quantidade especificada para a subplaylist
                if (contentCounter % subplaylist.afterContents === 0) {
                  // Filtra os conteúdos com base na localização
                  const filteredContents = subplaylist.contents.filter(
                    (content) => {
                      const location = content.location;
                      const cityMatch =
                        location?.cities &&
                        location?.cities.includes(terminal.location.city);
                      const stateMatch =
                        location?.states &&
                        location?.states.includes(terminal.location.state);
                      const terminalMatch =
                        location?.terminals &&
                        location?.terminals.includes(terminal._id);
                      const noLocationDefined =
                        !location?.cities &&
                        !location?.states &&
                        !location?.terminals;

                      return (
                        cityMatch ||
                        stateMatch ||
                        terminalMatch ||
                        noLocationDefined
                      );
                    }
                  );
                  if (filteredContents.length > 0) {
                    newContents.push(
                      ...filteredContents.map((c) => {
                        if (c.content?.toObject) {
                          c.content = c.content.toObject();
                          return {
                            ...c.content.toObject(),
                            isSubplaylistContent: true,
                            isPlaylistContent: false,
                          };
                        }
                      })
                    );
                  }
                }
              }
            }
          }
        }

        // Atualiza terminal.contents com a nova lista
        auxTerminal.push(...newContents);
      }

      const filteredContents = auxTerminal.filter((content) => {
        if (!content?.finalDate || !content) {
          return true; // inclui conteúdos sem dataFinal definida
        }
        const [day, month, year] = content.finalDate.split("/");
        const dateFinal = new Date(`${year}-${month}-${day}`);
        return dateFinal > new Date();
      });

      // Se populated for false, substitua o array 'contents' pelo array de seus IDs.
      if (req.query.populated) {
        auxTerminal = filteredContents;
      } else {
        auxTerminal = filteredContents.map((content) => content._id);
      }

      LogModel.create({
        entity: Entity,
        route: req.originalUrl,
        agent: req.headers["user-agent"],
        response: terminal,
        method: req.method,
        id: req.params.id,
      });

      await Model.findByIdAndUpdate(req.params.id, { status: "on" }); // atualiza o status do terminal no banco de dados
      return {
        ...terminal.toJSON(),
        contents: auxTerminal,
      };
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
  showContent = (req, res) => {
    super.show(req, res, async () => {
      try {
        const { idContent: contentId } = req.params;
        const content = await ContentModel.findById(contentId);
        if (!content) {
          return;
        }
        LogModel.create({
          entity: Entity,
          route: req.originalUrl,
          agent: req.headers["user-agent"],
          response: content,
          method: req.method,
          id: req.params.id,
        });

        return content;
      } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
      }
    });
  };
}

module.exports = Question;
