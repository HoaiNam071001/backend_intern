const auth = require('./auth');
const user = require('./user');
const profile = require('./profile');
const articles = require('./articles');
const messenger = require('./messenger');
const defaults = require('./default');

function route(app) {
    app.use('/api/users', auth);
    app.use('/api/user', user);
    app.use('/api/profiles', profile);
    app.use('/api/articles', articles);
    app.use('/api/messenger', messenger);
    app.use('/api/', defaults);
    app.use('/', (req, res) => {
        res.send('hello world');
    });
}

module.exports = route;
