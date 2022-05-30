const Model = require("../../models/Content");
const Service = require('../service');
const { uploadBase64, getObjectFromS3 } = require('../../helpers/s3')
const Entity = 'content'

class Content extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res, async () => {
      try {
        const contents = await Model.find(req.query);

        for (const content of contents) {
          const fileName = `${req.user._id.toString()}/${content._id.toString()}`
          const file = await getObjectFromS3("saude-tv-contents", fileName)
          content.file = file
        }
        return contents
      } catch (error) {
        console.error(error);
      }
    });
  }

  show = (req, res) => {
    super.show(req, res)
  }

  store = (req, res) => {
    super.store(req, res, async () => {
      try {
        const fileBase64 = req.body.file
        delete req.body.file;
        const content = await Model.create(req.body);
        const fileName = `${req.user._id.toString()}/${content._id.toString()}`
        await uploadBase64("saude-tv-contents", fileName, fileBase64)
        return content
      } catch (error) {
        console.error(error);
      }
    });
  }

  update = (req, res) => {
    super.update(req, res)
  }

  destroy = (req, res) => {
    super.destroy(req, res)
  }
}

module.exports = Content
