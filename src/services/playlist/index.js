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

  index = (req, res) => {
    super.index(req, res);
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      let newDate = new Date();
      const playlist = await Model.findById(req.params.id).populate({
        path: "contents",
      });
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
      const oldContentIds = oldPlaylist.contents.map(content => content._id.toString());
  
      // Converter req.body.contents em um conjunto para facilitar comparações
      const newContentIds = req.body.contents.map(content => content._id.toString());
  
      for (const element of req.body.terminals) {
        const terminal = await TerminalModel.findById(element);
  
        // Converter terminal.contents em um conjunto para simplificar a adição e remoção de elementos
        const terminalContentsSet = new Set(terminal.contents.map(content => content.toString()));
  
        // Remover conteúdos que não estão mais presentes na nova playlist mas estavam na antiga
        for (const contentId of oldContentIds) {
          if (!newContentIds.includes(contentId)) {
            terminalContentsSet.delete(contentId);
          }
        }
  
        // Adicionar novos conteúdos que estão presentes na nova playlist e não estavam na antiga
        for (const contentId of newContentIds) {
          if (!oldContentIds.includes(contentId) && !terminalContentsSet.has(contentId)) {
            terminalContentsSet.add(contentId);
          }
        }
  
        // Converter o conjunto de volta em uma matriz e verificar se houve alterações
        const updatedContents = Array.from(terminalContentsSet);
        if (
          JSON.stringify(terminal.contents) !== JSON.stringify(updatedContents)
        ) {
          terminal.contents = updatedContents;
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
