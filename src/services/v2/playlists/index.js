const Model = require("../../../models/Playlist");
const Service = require("../../service");
const Entity = "playlist";
const { parse } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");

class Playlist extends Service {
  constructor() {
    super(Entity, Model);
  }

  store = (req, res) => {
    super.store(req, res);
  };
}

module.exports = Playlist;
