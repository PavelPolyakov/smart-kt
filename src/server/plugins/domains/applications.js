const CronJob = require('cron').CronJob;
const Promise = require('bluebird');
const debug = require('debug')('domain:applications');
const moment = require('moment');
const _ = require('lodash');

module.exports = function (app) {
    const applications = {};

    return applications;
}