const mongoose = require('mongoose');

const serversSchema = mongoose.Schema({
    serverID: String,
    serverName: String,
    prefix: String,
    roles: {
        owner: String,
        admin: String,
        dj: String,
        user: String,
        mute: String,
    },
    spamChannels: [String],
});

module.exports = mongoose.model('Servers', serversSchema);