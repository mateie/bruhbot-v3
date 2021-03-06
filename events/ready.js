const { client } = require('../index');
const SpotifyWAPI = require('spotify-web-api-node');
const spotifyAPI = new SpotifyWAPI();
spotifyAPI.setAccessToken(process.env.SPOTIFY_API_KEY);

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
                name: 'VALORANT',
                type: 'PLAYING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Tom Clancy\'s Rainbow Six Siege',
                type: 'PLAYING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Counter-Strike: Global Offensive',
                type: 'PLAYING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Anime Thighs',
                type: 'LISTENING',
            },
        },
        {
            status: 'online',
            activity: {
                name: 'Anime',
                type: 'WATCHING',
            },
        },
        {
            status: 'dnd',
            activity: {
                name: 'Visual Studio Code',
                type: 'PLAYING',
            },
        },
        {
            status: 'idle',
            activity: {
                name: 'Suggestions',
                type: 'LISTENING',
            },
        },
    ];

    setInterval(() => {
        spotifyAPI.getMyCurrentPlayingTrack()
        .then(data => {
            let trackName = data.body.item.name;
            let trackArtist = data.body.item.artists[0].name;
            let track = `${trackName} by ${trackArtist}`;
            if(!data.body.is_playing) {
                let index = Math.floor(Math.random() * status.length);
                client.user.setPresence(status[index]);
            } else {
                client.user.setPresence({ activity: { name: track, type: 'LISTENING' }, status: 'online' });
            }
        })
        .catch(err => {
            console.error(err);
        });
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