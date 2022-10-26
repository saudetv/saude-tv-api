const Model = require("../../models/Content");
const Service = require("../service");
const { uploadBase64, getObjectFromS3 } = require("../../helpers/s3");
const { default: axios } = require("axios");
const Entity = "content";

class Content extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res, async () => {
      try {
        let contents = [];
        if (req.query.pagination == false) {
          contents = await Model.find(req.query);
        } else {
          contents = await Model.paginate(req.query, {
            page: req.query.page,
            pagination: req.query.pagination || true,
          });
        }
        return contents;
      } catch (error) {
        console.error(error);
      }
    });
  };

  show = (req, res) => {
    super.show(req, res, async () => {
      try {
        const content = await Model.findById(req.params.id);
        if (content.type != "RSS") {
          const fileName = content.file;
          console.info(
            `${content.name}, started download. https://saude-tv-contents.s3.us-east-1.amazonaws.com/${fileName}`
          );
          // const file = await getObjectFromS3(fileName);
          console.info(
            `${content.name}, ended download. https://saude-tv-contents.s3.us-east-1.amazonaws.com/${fileName}`
          );
          // content.file = file;
        }
        return content;
      } catch (error) {
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
          const content = await Model.create(req.body);
          const fileName = `${req.user.customer.toString()}/${content._id.toString()}`;
          const thumbName = `${req.user.customer.toString()}/${content._id.toString()}/thumb`;
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
      console.log(updatedAt);
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
