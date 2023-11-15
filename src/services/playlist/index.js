const Model = require("../../models/Playlist");
const Service = require("../service");
const Entity = "playlist";
const { format, parseISO, parse } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");
const TerminalModel = require("../../models/Terminal");

class Content extends Service {
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
      const model = await Model.paginate(query, options);
      return super.index(req, res, async () => model);
    } catch (error) {
      console.error(error);
    }
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      let newDate = new Date();
      const playlist = await Model.findById(req.params.id)
        .populate({
          path: "contents", // Populating contents of the main playlist
          model: "Content",
        })
        .populate({
          path: "subPlaylist.contents.content", // Populating contents within each subPlaylist
          model: "Content",
        })
        .populate({
          path: "subPlaylist.contents.location.terminals", // Populating contents within each subPlaylist
          model: "Terminal",
        })
        .populate({ path: "terminals", model: "Terminal" });

      playlist.contents.forEach((element, index) => {
        let finalDate = parse(element.finalDate, "dd/MM/yyyy", new Date(), {
          locale: ptBR,
        });
        if (finalDate <= newDate) {
          playlist.contents.splice(index, 1);
        }
      });
      return playlist;
    });
  };

  store = async (req, res) => {
    super.store(req, res, async () => {
      const contentIds = req.body.contents.map((content) => content._id);
      for (const element of req.body.terminals) {
        const terminal = await TerminalModel.findById(element);
        for (const contentId of contentIds) {
          if (!terminal.contents.includes(contentId)) {
            terminal.contents.push(contentId);
          }
        }
        await terminal.save();
      }
      const playlist = await Model.create(req.body);
      return playlist;
    });
  };

  update = async (req, res) => {
    super.update(req, res, async () => {
      // Armazenar a playlist antiga
      const oldPlaylist = await Model.findById(req.params.id);

      // Converter oldPlaylist.contents em um conjunto para facilitar comparações
      const oldContentIds = oldPlaylist.contents.map((content) =>
        content._id.toString()
      );

      // Converter req.body.contents em um conjunto para facilitar comparações
      const newContentIds = req.body.contents.map((content) =>
        content._id.toString()
      );

      // Converter oldPlaylist.terminals e req.body.terminals em conjuntos
      const oldTerminalIds = new Set(oldPlaylist.terminals.map(String));
      const newTerminalIds = new Set(req.body.terminals.map(String));

      const removedTerminals = [...oldTerminalIds].filter(
        (id) => !newTerminalIds.has(id)
      );
      const addedTerminals = [...newTerminalIds].filter(
        (id) => !oldTerminalIds.has(id)
      );

      for (const terminalId of removedTerminals) {
        const terminal = await TerminalModel.findById(terminalId);
        terminal.contents = terminal.contents.filter(
          (contentId) => !oldContentIds.includes(contentId.toString())
        );
        await terminal.save();
      }

      for (const element of req.body.terminals) {
        const terminal = await TerminalModel.findById(element);

        // Converter terminal.contents em um array para simplificar a adição e remoção de elementos
        const terminalContentsArray = terminal.contents.map((content) =>
          content.toString()
        );

        // Remover conteúdos que não estão mais presentes na nova playlist mas estavam na antiga
        for (const contentId of oldContentIds) {
          const index = terminalContentsArray.indexOf(contentId);
          if (index !== -1 && !newContentIds.includes(contentId)) {
            terminalContentsArray.splice(index, 1);
          }
        }

        // Adicionar novos conteúdos que estão presentes na nova playlist e não estavam na antiga
        for (const contentId of newContentIds) {
          if (
            (!oldContentIds.includes(contentId) &&
              !terminalContentsArray.includes(contentId)) ||
            terminalContentsArray.length === 0 ||
            !terminalContentsArray.includes(contentId)
          ) {
            terminalContentsArray.push(contentId);
          }
        }

        // Verificar se houve alterações
        if (
          JSON.stringify(terminal.contents) !==
          JSON.stringify(terminalContentsArray)
        ) {
          terminal.contents = terminalContentsArray;
          await terminal.save();
        }
      }

      const updatedPlaylist = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      return updatedPlaylist;
    });
  };

  destroy = async (req, res) => {
    const playlist = await Model.findById(req.params.id);
    const terminals = await TerminalModel.find({
      _id: { $in: playlist.terminals },
    });
    const contentIds = playlist.contents.map((content) => content.toString());

    for (const terminal of terminals) {
      const newContents = terminal.contents.filter((content) => {
        if (content) {
          return !contentIds.includes(content.toString());
        }
      });
      terminal.contents = newContents;
      await terminal.save();
    }

    const deletedId = await super.destroy(req, res);

    return deletedId;
  };

  playlistsByWeek = async () => {
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

module.exports = Content;
