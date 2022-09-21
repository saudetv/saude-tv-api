const cron = require("node-cron");
const RssServiceClass = require("../services/rss");
const TerminalServiceClass = require("../services/terminals");
const rssService = new RssServiceClass();
const terminalService = new TerminalServiceClass();

cron.schedule("*/50 * * * *", async () => {
  await rssService.getRssData();
});

cron.schedule("*/30 * * * * *", async () => {
  await terminalService.checkTerminalHealth();
});
