const { client } = require('../index');

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const Servers = require('../models/servers');
const Users = require('../models/users');

client.on('ready', () => {
    let status = [
        {
            status: 'online',
            activity: {
                name: 'Immortal Technique',
                type: 'LISTENING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Tech N9ne',
                type: 'LISTENING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Eminem',
                type: 'LISTENING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'D12',
                type: 'LISTENING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Joyner Lucas',
                type: 'LISTENING',
            },
        },
        {
            status: 'dnd',
            activity: {
                name: 'Visual Studio Code',
                type: 'PLAYING',
            },
        },
    ];

    setInterval(() => {
        let index = Math.floor(Math.random() * status.length);
        client.user.setPresence(status[index]);
    }, 10000);

    client.guilds.cache.forEach(guild => {
        Servers.findOne({
            serverID: guild.id,
        }, (err, res) => {
            if(err) console.error(err);

            if(!res) {
                let customGuild = guild;
                client.emit('guildCreate', customGuild);
                console.debug(`Adding new guild to the database... (Guild ID: ${guild.id})`);
            }
        });

        guild.members.cache.forEach(member => {
            Users.findOne({
                serverID: guild.id,
                userName: member.user.username,
                userID: member.user.id,
            }, (err, res) => {
                if(err) console.error(err);

                if(!res && !member.user.bot) {
                    client.emit('guildMemberAdd', member);
                    console.debug(`Adding new guild member to the database... (Guild ID: ${guild.id}, User ID: ${member.id}, Name: ${member.user.username})`);
                }
            });
        });
    });

    console.info('Running...');
});