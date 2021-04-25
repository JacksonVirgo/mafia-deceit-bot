const commands = {
    example: require('./ExampleCommand'),
    // players: require('./list/CreatePlayerChannels'),
};
function handleCommand(client, message, config) {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.PREFIX)) return;
    let content = message.content;
    let cmd = parseCommand(content, config.PREFIX);

    let foundCommand = false;
    for (const handle in commands) {
        if (cmd.command === handle) {
            foundCommand = true;
            let instance = new commands[handle](client, message, config);
            if (instance) instance.run();
        }
    }
    return foundCommand;
}
function parseCommand(message, prefix) {
    let body = message.slice(prefix.length);
    let args = body.split(' ');
    let command = args.shift().toLowerCase();
    return { body, args, command };
}

module.exports = { handleCommand, parseCommand };
