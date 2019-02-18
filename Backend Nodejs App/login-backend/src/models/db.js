const mongoose = require('mongoose');
const config = require('../config.json');
mongoose.connect(process.env.MONGODB_URI || config.connectionString);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('./UserSchema')
};
