const Model = require("../../../models/Playlist");
const TerminalModel = require("../../../models/Terminal");
const Service = require("../../service");
const Entity = "playlist";
const { parse } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");

class Playlist extends Service {
  constructor() {
    super(Entity, Model);
  }

  store = async (req, res) => {
    super.store(req, res, async () => {
      const playlist = await Model.create(req.body);
      for (const element of req.body.terminals) {
        const terminal = await TerminalModel.findById(element);
        terminal.playlists.push(playlist._id);
        await terminal.save();
      }
      return playlist;
    });
  };
}

module.exports = Playlist;
