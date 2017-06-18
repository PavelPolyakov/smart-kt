module.exports = function () {
    const app = this;

    app.domains = {
        loans: require('./loans')(app),
        applications: require('./applications')(app)
    };
}