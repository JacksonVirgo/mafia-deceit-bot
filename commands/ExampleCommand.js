const Command = require('./Command');
module.exports = class CreatePlayer extends Command {
    constructor(client, message, config) {
        super(client, message, config);
    }
    run() {
        this.message.channel.send('Successful Command');
    }
};
