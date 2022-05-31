const Model = require("../../models/Playlist");
const Service = require('../service');
const Entity = 'playlist'

class Content extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res)
  }

  show = (req, res) => {
    super.show(req, res, async () => {
      const playlist = await Model.findById(req.params.id).populate("contents");
      return playlist
    })
  }

  store = (req, res) => {
    super.store(req, res)
  }

  update = (req, res) => {
    super.update(req, res)
  }

  destroy = (req, res) => {
    super.destroy(req, res)
  }
}

module.exports = Content
