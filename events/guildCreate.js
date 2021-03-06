const { client } = require('../index');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Servers = require('../models/servers');
const Users = require('../models/users');

client.on('guildCreate', guild => {
    const newServer = new Servers({
        serverID: guild.id,
        serverName: guild.name,
        prefix: '!',
        roles: {
            owner: "",
            admin: "",
            dj: "",
            user: "",
            mute: "",
        },
        spamChannels: [],
    });

    newServer.save().catch(err => console.error(err));

    let guildMembers = [];

    guild.members.cache.forEach(member => {
        if(!member.user.bot) {
            guildMembers.push({
                serverID: member.guild.id,
                userName: member.user.username,
                userID: member.user.id,
                level: 0,
                xp: 0,
            });
        }
    });

    Users.insertMany(guildMembers, err => {
        if(err) console.error(err);
    });

    let owner = client.users.cache.get(guild.ownerID);
    if(!owner) guild.leave();

    owner.send(`Hello! I just configured your **${guild.name}** server. Please, setup all the required permission, roles and other things`).catch(err => {
        if(err) return console.error(err);
    });
});