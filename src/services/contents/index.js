const Model = require("../../models/Content");
const TerminalModel = require("../../models/Terminal");
const Service = require("../service");
const { uploadBase64, getObjectFromS3 } = require("../../helpers/s3");
const { default: axios } = require("axios");
const Entity = "content";

class Content extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = async (req, res) => {
    const query = req.query;
    const sort = "-createdAt";
    const pagination = req.query.pagination === "false" ? false : true;
    const options = { sort, pagination, page: req.query.page };

    try {
      const contents = await Model.paginate(query, options);
      return super.index(req, res, async () => contents);
    } catch (error) {
      console.error(error);
    }
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      try {
        const content = await Model.findById(req.params.id);
        if (!content) {
          res.status(404).json({ message: "Content not found." });
          return;
        }
        return content;
      } catch (error) {
        res.status(500).json({ message: error.message });
        console.error(error);
      }
    });
  };

  store = (req, res) => {
    super.store(req, res, async () => {
      try {
        if (req.body.type === "VIDEO") {
          const fileBase64 = req.body.file;
          const thumbBase64 = req.body.thumbnail;
          delete req.body.file;
          delete req.body.thumbnail;
          let terminal = [];
          const content = await Model.create(req.body);
          console.log(req.body);
          let amount = req.body.amount || 1; // Default to 1 if amount is not specified.
          delete req.body.amount;
          await req.body.terminals.forEach(async (element) => {
            for (let i = 0; i < amount; i++) {
              if (req.body.position === "initial") {
                const terminal = await TerminalModel.findOne({ _id: element });
                terminal.contents.unshift(content._id);
                await TerminalModel.updateOne(
                  { _id: element },
                  { contents: terminal.contents }
                );
              } else if (req.body.position === "random") {
                const terminal = await TerminalModel.findOne({ _id: element });
                const randomPosition = Math.floor(
                  Math.random() * (terminal.contents.length + 1)
                );
                terminal.contents.splice(randomPosition, 0, content._id);
                await TerminalModel.updateOne(
                  { _id: element },
                  { contents: terminal.contents }
                );
              } else {
                terminal = await TerminalModel.findOneAndUpdate(
                  { _id: element },
                  { $push: { contents: content._id } }
                );
              }
            }
          });
          const fileName = `${req.user.customer._id.toString()}/${content._id.toString()}`;
          const thumbName = `${req.user.customer._id.toString()}/${content._id.toString()}/thumb`;
          const uri = await uploadBase64(
            process.env.AWS_BUCKET,
            fileName,
            fileBase64,
            "video"
          );
          content.file = uri;

          const uriThumb = await uploadBase64(
            process.env.AWS_BUCKET,
            thumbName,
            thumbBase64,
            "image"
          );
          content.thumbnail = uriThumb;
          content.save();
          return content;
        } else {
          return await Model.create(req.body);
        }
      } catch (error) {
        console.error(error);
      }
    });
  };

  getupdatedAt = async (req, res) => {
    try {
      const updatedAt = await axios.get();
      res.status(200).json(updatedAt.data);
    } catch (error) {
      res.status(404).json({ error: "Não encontrado." });
    }
  };

  update = (req, res) => {
    super.update(req, res);
  };

  destroy = (req, res) => {
    super.destroy(req, res);
  };

  contentsByWeek = async (query) => {
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

  destroyOldContents = async () => {
    let newDate = new Date();
    newDate.setMonth(newDate.getMonth() - 2);
    const contents = await Model.updateMany(
      {
        createdAt: { $lt: newDate },
      },
      { status: false }
    );
    console.log(`Updated ${contents.modifiedCount} videos.`);
  };
}

module.exports = Content;
