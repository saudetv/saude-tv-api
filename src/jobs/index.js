
const cron = require('node-cron');
const RssServiceClass = require('../services/rss');
const rssService = new RssServiceClass;

cron.schedule('* * * *', async () => {
    await rssService.getRssData()
});