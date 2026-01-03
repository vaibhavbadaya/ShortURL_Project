const express = require('express');
const router = express.Router();
// const { URL } = require('../models/url');
const { handleCreateShortUrl,handleGetAnalytics } = require('../controllers/url');

router.post('/', handleCreateShortUrl);

router.get('/api/analytics/:shortUrl', handleGetAnalytics);

module.exports = router;