const cron = require("node-cron");
const RssServiceClass = require("../services/rss");
const TerminalServiceClass = require("../services/terminals");
const ContentServiceClass = require("../services/contents");
const rssService = new RssServiceClass();
const terminalService = new TerminalServiceClass();
const contentService = new ContentServiceClass();

cron.schedule("*/50 * * * *", async () => {
  await rssService.getRssData();
});

cron.schedule("*/30 * * * * *", async () => {
  await terminalService.checkTerminalHealth();
});

cron.schedule("0 23 * * *", async () => {
  await contentService.destroyOldContents();
});

