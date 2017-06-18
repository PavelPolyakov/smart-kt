const Promise = require('bluebird');
const _ = require('lodash');
const fs = require('fs');

module.exports = function () {
    const app = this;

    // setup applications cron's
    require('./applications')(app);
    // setup loans cron's
    require('./loans')(app);
}