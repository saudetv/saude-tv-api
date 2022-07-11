const Model = require("../../models/Content");
const Service = require("../service");
const Entity = "rss";
const axios = require("axios");
const parseString = require("xml2js").parseString;
const moment = require("moment");

class Question extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res);
  };

  show = (req, res) => {
    super.show(req, res);
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

  getRssData = async () => {
    try {
      moment.locale();
      let contents = [];
      const content = await Model.find({ type: "RSS" });
      for (const rss of content) {
        await axios.get(rss.url).then((response) => {
          parseString(response.data, async (err, result) => {
            if (err) {
              console.error(err);
            } else {
              if (result.hasOwnProperty("rss")) {
                if (result.rss.channel[0].hasOwnProperty("image"))
                  rss.logo = result.rss.channel[0].image[0].url[0];
                for (const element of result.rss.channel[0].item) {
                  if (element.hasOwnProperty("pubDate")) {
                    if (
                      moment(element.pubDate[0]).format() >
                        moment().subtract(1, "days").format() &&
                      contents.length < 5
                    ) {
                      contents.push(element);
                    }
                  }
                }
              }
            }
          });
        });
        if (contents.length > 0) {
          rss.rss = contents;
          console.log(`Saved total ${contents.length} of rss in ${rss.name}.`);
          await rss.save();
          contents = [];
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
}

module.exports = Question;
