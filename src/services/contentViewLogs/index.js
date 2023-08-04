const Model = require("../../models/ContentViewLog");
const Service = require("../service");
const Entity = "contentViewLog";

class ContentViewLogs extends Service {
  constructor() {
    super(Entity, Model);
  }

  report = async () => {
    try {
      const result = await Model.aggregate([
        {
          $group: {
            _id: {
              terminal: "$terminal",
              content: "$content",
            },
            count: { $sum: 1 },
          },
        },
      ]);

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = ContentViewLogs;
