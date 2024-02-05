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

  update = async (req, res) => {
    super.update(req, res, async () => {
      const playlist = await Model.findById(req.params.id);
      const currentTerminals = playlist.terminals.map((t) => t.toString());
      const newTerminals = req.body.terminals.map((t) => t._id.toString());

      // Remove playlist from terminals that were unlinked
      const terminalsToRemove = currentTerminals.filter(
        (t) => !newTerminals.includes(t)
      );
      for (const terminalId of terminalsToRemove) {
        const terminal = await TerminalModel.findById(terminalId);
        if (terminal) {
          terminal.playlists = terminal.playlists.filter(
            (p) => p.toString() !== playlist._id.toString()
          );
          await terminal.save();
        }
      }

      // Add playlist to terminals that were linked
      for (const terminalId of newTerminals) {
        const terminal = await TerminalModel.findById(terminalId);
        if (!terminal.playlists.includes(playlist._id)) {
          terminal.playlists.push(playlist._id);
          await terminal.save();
        }
      }

      // Update playlist
      const updatedPlaylist = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

      return updatedPlaylist;
    });
  };
}

module.exports = Playlist;
