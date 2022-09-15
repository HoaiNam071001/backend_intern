const express = require('express');
const app = express();
require('dotenv').config();
require('./models/Article');
require('./models/User');
require('./models/Comment');
require('./models/Room');
require('./models/Message');

const port = 3060;
const route = require('./routes');
const socket = require('./socket/socket');

const cors = require('cors');
const connectDB = require('./database');

connectDB();
app.use(cors());
// define : post
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
route(app);

const http = require('http');
const server = http.createServer(app);

socket(server);

app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        errors: {
            error: [err.message],
        },
    });
});
server.listen(process.env.PORT || port, () => {
    console.log(`Example app listening on port ${server.address().port}`);
});
