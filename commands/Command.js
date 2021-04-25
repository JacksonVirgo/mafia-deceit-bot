module.exports = class Command {
    constructor(client, message, config) {
        const { channel, guild, content } = message;
        this.config = config;
        this.client = client;
        this.message = message;
        this.guild = guild;
        this.channel = channel;
        this.content = content;
        this.command = this.parseCommand(content);
    }
    parseCommand(cmd) {
        let body = cmd.slice(this.config.PREFIX.length);
        let args = body.split(' ');
        let command = args.shift().toLowerCase();
        return { body, args, command };
    }
    run() {
        console.log('Command has no body');
    }
    sendMessage(message) {
        this.channel.send(message);
    }
};
