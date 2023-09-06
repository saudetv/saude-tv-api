const Log = require("../models/Logs"); 
const checkDownloadLimit = async (req, res, next) => {
  const terminalId = req.params.id;
  const contentId = req.params.idContent;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  try {
    const count = await Log.countDocuments({
      route: `/v1/terminals/${terminalId}/contents/${contentId}`,
      createdAt: {
        $gte: startOfToday,
        $lt: endOfToday,
      },
    });

    if (count >= 5) {
      return res
        .status(403)
        .json({ message: "Download limit for today reached" });
    }

    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkDownloadLimit;
