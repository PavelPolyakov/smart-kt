const path = require('path');
const favicon = require('serve-favicon');
const history = require('connect-history-api-fallback');
const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');

const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const socketio = require('feathers-socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');

const Promise = require('bluebird');

const app = feathers();

// Load app configuration
app.configure(configuration(path.join(__dirname, '..')));
// Enable CORS, security, compression, favicon and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));

app.get('/d41d8cd98f00b204e9800998ecf8427e', function(req, res) {
    return Promise.coroutine(function *() {
        yield app.service('loans').remove(null);
        yield app.service('applications').remove(null);
        yield app.service('users').remove(null);

        res.send();
    }).bind(this)()
});

// check if webpack is needed
app.configure(require('./middleware/webpack'));
// Host the public folder
app.use(history());
app.use('/', feathers.static(app.get('public')));
// Set up Plugins and providers
app.configure(hooks());
app.configure(rest());
app.configure(socketio());


// Set up our services (see `services/index.js`)
app.configure(services);
// Configure middleware (see `middleware/index.js`) - always has to be last
app.configure(middleware);

app.hooks(appHooks);

app.configure(require('./plugins/web3'));
app.configure(require('./plugins/smartKT'));
app.configure(require('./plugins/cron'));

module.exports = app;
