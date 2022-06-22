
const cron = require('node-cron');
const RssServiceClass = require('../services/rss');
const rssService = new RssServiceClass;

cron.schedule('*/59 * * * *', async () => {
    await rssService.getRssData()
});
