const Discord = require('discord.js');
const mongoose = require('mongoose');

const Servers = require('../../models/servers');

mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

exports.run = async (client, message, args) => {
    if (!args[0]) {
        let spamChannelsInfo = "";
        if (client.spamChannels.length >= 1) spamChannelsInfo = `[<#${client.spamChannels.join('>', '<#')}>]`;
        else spamChannelsInfo = `[]`;

        let help = new Discord.MessageEmbed()
            .setTitle(`Settings`)
            .addField(`Prefix`, `${client.prefix}`)
            .addField(`Spam Channels`, spamChannelsInfo);

        client.settings.roles.nodes.forEach(role => {
            if (role.name != '@everyone' && role.name != 'BOT_OWNER') help.addField(`Role: ${role.name.toLowerCase()}`, `<@&${role.id}> (${role.id})`);
        });

        message.channel.send(help);
    } else if (args[1]) {
        let key = args[0], value = args.slice(1).join(' ');

        await Servers.findOne({
            serverID: message.guild.id,
        }, (err, settings) => {
            if (!settings) {
                return message.channel.send('Unknown error occured. Try again later');
            }

            let info = undefined;
            if(key == 'prefix') {
                settings.prefix = value;
                info = `'${value}'`;
            } else if(key.startsWith('role:')) {
                let newRole = message.mentions.roles.first() || message.guild.roles.find(role => role.id == value) || undefined;

                if(!newRole) {
                    return message.channel.send('Role not found');
                }

                client.settings.role.nodes.forEach(role => {
                    if(role.name != '@everyone' && key == `role:${role.name.toLowerCase()}`);
                    {
                        eval(`settings.roles.${role.name.toLowerCase()} = newRole.id;`);
                        info = `<@&${newRole.id}> (${newRole.id})`;
                    }
                });
            } else if(key == 'spamChannels') {
                if(value == 'add') {
                    let exists = settings.spamChannels.some(e => e == message.channel.id);
                    if(!exists) {
                        settings.spamChannels.push(message.channel.id);
                    }
                } else if(key == 'remove') {
                    settings.spamChannels = settings.spamChannels.filter(e => e != message.channel.id);
                }

                if(settings.spamChannels.length >= 1) info = `[<#${settings.spamChannels.join('>', '<#')}>]`;
                else info = `[]`;
            }

            settings.save();
            if(info) {
                message.channel.send(`Successfully changed '${key}' value to ${info}`);
            } else {
                message.channel.send('The setting your provided is not found in the database');
            }
        });
    } else {
        message.channel.send('No value provided');
    }
};

exports.help = {
    name: 'settings',
    aliases: ['sett', 'options', 'config', 'cfg'],
    args: ['[key]', '[value | @role]'],
    permission: 'OWNER',
    description: 'Edit the server settings',
};