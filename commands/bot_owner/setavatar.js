const Discord = require('discord.js');

exports.run = async (client, message) => {
    let avatarCurrent = client.user.displayAvatarURL({ format: 'png', dynamic: true, size: 128 });
    let avatarNew = message.attachments.first();

    if(!avatarNew) {
        return message.channel.send('Please attach an image to set the avatar');
    }

    client.user.setAvatar(avatarNew);

    const embed = new Discord.MessageEmbed()
    .setTitle('Bot\'s Avatar Changed')
    .addField('From', avatarCurrent)
    .addField('To', avatarNew);

    message.channel.send({ embed });

};

exports.help = {
    name: 'setavatar',
    aliases: ['botavatar'],
    args: ['<picture attachment>'],
    permission: 'BOT_OWNER',
    description: 'Sets a Bot\'s avatar to the provided one',
};