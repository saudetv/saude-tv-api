const Model = require("../../models/Playlist");
const Service = require("../service");
const Entity = "playlist";
const { format, parseISO, parse } = require("date-fns");
const ptBR = require("date-fns/locale/pt-BR");

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
          delete playlist.contents[index];
        }
      });
      return playlist;
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

module.exports = Content;
