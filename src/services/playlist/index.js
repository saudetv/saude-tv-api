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
      const playlist = await Model.findById(req.params.id).populate("contents", "-thumbnail");
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

    console.log(result);

    return result;
  };
}

module.exports = Content
