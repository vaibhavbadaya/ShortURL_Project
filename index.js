const express = require('express');
const PORT = 8001;
const app = express();
const {connectMongoDB} = require('./config');
const urlRouter = require('./routes/url');
const { URL } = require('./models/url');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectMongoDB('mongodb://localhost:27017/shorturldb')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/api/url', urlRouter);

app.get('/api/:shortUrl', async (req, res) => {
    try {
        const shortUrl = req.params.shortUrl;
        const Entry = await URL.findOneAndUpdate(
            { shortUrl: shortUrl },
            { $push: { visitedHistory: { timestamp: new Date() } } },
            { new: true }
        );

        if (!Entry) return res.status(404).send('Short URL not found');
        return res.redirect(Entry.redirectUrl);
    } catch (err) {
        console.error(err);
        return res.status(500).send('Server error');
    }
});
    


app.listen(8001, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});