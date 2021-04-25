const Command = require('../Command');
const { createChannel, getCategory } = require('../../utilities/channelManager');
module.exports = class CreatePlayer extends Command {
    constructor(client, message, config) {
        super(client, message, config);
    }
    run() {
        let arg = parseInt(this.command.args[0]);
        if (!isNaN(arg)) this.createPlayerChats();
        else this.sendMessage('Invalid Number');
    }

    getPanel(panel) {
        let args = panel.split('-');
        return args[1] === 'panel' ? args[0] : null;
    }
    createPlayerChats() {
        let panel = this.getPanel(this.channel.name.toLowerCase());
        let amount = this.command.args[0];
        let category = getCategory(this.guild, panel);
        if (category) {
            for (let i = 0; i < amount; i++) {
                createChannel(this.guild, `${panel}-${i + 1}`);
            }
            this.sendMessage(`Created ${amount} player chats`);
        }
    }
};
