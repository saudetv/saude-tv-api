const Model = require("../../models/Content");
const Service = require('../service');
const Entity = 'rss'
const axios = require("axios")
const parseString = require('xml2js').parseString;
const moment = require("moment")

class Question extends Service {
  constructor() {
    super(Entity, Model);
  }

  index = (req, res) => {
    super.index(req, res)
  }

  show = (req, res) => {
    super.show(req, res)
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

  getRssData = async () => {
    try {
      moment.locale();
      const rss = await Model.find({ type: "RSS" })
      await rss.forEach(async rss => {
        await axios.get(rss.url)
          .then(response => {
            parseString(response.data, async (err, result) => {
              if (err) {
                console.error(err);
              } else {
                if (result.hasOwnProperty("rss")) {
                  await result.rss.channel[0].item.forEach(element => {
                    if (element.hasOwnProperty("pubDate")) {
                      if (element.pubDate[0] > moment().subtract(3, 'days').format()) {
                        const repeatedRss = rss.rss.filter((val) => {
                          return val.link[0] === element.link[0]
                        })
                        if (repeatedRss.length == 0)
                          rss.rss.push(element)

                      }
                    }
                  });
                }
              }
            });
          })
        await rss.save()
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Question
