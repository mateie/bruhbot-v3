exports.run = async (client, message, args) => {

    const game = args[0];

    if(!game) {
        return message.reply('Please provide a game name');
    }

};

exports.help = {
    name: 'addreaction',
    aliases: ['addr'],
    args: ['[game name]'],
    permission: 'OWNER',
    description: 'Adds a reaction to the game reaction chooser',
};