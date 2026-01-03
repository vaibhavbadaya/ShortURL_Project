const { URL } = require('../models/url');
const shortid = require('shortid');


async function handleCreateShortUrl(req, res) {
    const body = req.body || {};
    if (!body.url) return res.status(400).json({ error: 'URL is required' });
    const shortUrl = typeof shortid.generate === 'function' ? shortid.generate() : (typeof shortid === 'function' ? shortid() : String(Date.now()));
    await URL.create({
        redirectUrl: body.url,
        shortUrl: shortUrl,
        visitedHistory: [],

    });
    return res.json({ id: shortUrl });
}


async function handleGetAnalytics(req, res) {
    const shortUrl = req.query.shortUrl;
    const result = await URL.findOne({ shortUrl });
    if (!result) return res.status(404).json({ error: 'Short URL not found' });
    return res.json({ totalClicks: result.visitedHistory.length, analytics: result.visitedHistory });
}

module.exports={
    handleCreateShortUrl,
    handleGetAnalytics,
};