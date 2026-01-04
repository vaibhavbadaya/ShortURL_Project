const express = require('express');
const PORT = 8001;
const app = express();
const {connectMongoDB} = require('./config');
const { URL } = require('./models/url');
const path = require('path');

const userRouter = require('./routes/user');
const staticRouter = require('./routes/staticRouter');
const urlRouter = require('./routes/url');

// Body parsers must be registered before route handlers that rely on `req.body`
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/user', userRouter);

connectMongoDB('mongodb://localhost:27017/shorturldb')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.set('view engine', 'ejs');
app.set("views",path.resolve("./views"));

app.use('/url', urlRouter);
app.use('/', staticRouter);

app.get('/test', async (req, res) => {
    const allUrls = await URL.find({})
    return res.render("home", { 
        urls: allUrls })
});

// Catch-all redirect route (must be after all other routes)
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