const Discord = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();

const WHITELIST = ["normal","special","other","newbie"];


if (config.token === "notfilled")
    return console.log("Please set your token");

client.on('ready', () => {
    console.log(client.user.username + " is online");
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(process.env.PREFIX)) return;

    const cmdBody = message.content.slice(process.env.PREFIX.length);
    const args = cmdBody.split(' ');
    const command = args.shift().toLowerCase();

    console.log(`total: ${message.content}\n
    cmdBody: ${cmdBody}\n
    args: ${args}\n
    command: ${command}`);

    if (command === 'clear') {
        let channelName = message.channel.name.toLowerCase();
        switch (channelName) {
            case "normal-panel":
                message.channel.send("Resetting Perms for Normal");
                break;
            default:
                message.channel.send("You don't have the perms to use this command");
                break;
        }
    }

    switch (command) {
        case "players":
            let arg = parseInt(args[0]);
            if (!isNaN(arg)) {
                createPlayerChats(message, message.channel.name.toLowerCase(), clampAmt(arg, 0, 50));
            } else {
                message.channel.send("You sent an invalid number");
            }
            break;
        case "clear":
            clearPlayerChats(message, message.channel.name.toLowerCase());
            break;
        case "private":
            let privateArg = parseInt(args[0]);
            if (!isNaN(privateArg)) {
                createPrivateChats(message, message.channel.name.toLowerCase(), clampAmt(privateArg, 0, 50));
            } else {
                message.channel.send("You sent an invalid number");
            }
            break;
    }
});

function getCategory(type) {
    // "[result]-panel"
    var args = type.split('-');
    return args[0];
}

function clampAmt(num, min, max) {
    if (num < min) num = min;
    if (num > max) num = max;
}

function createPlayerChats(msg, type, amt) {
    var cat = getCategory(type);
    if (WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            for (var i = 0; i < amt; i++) {
                guild.channels.create(`${cat}-${i+1}`).then(channel => {
                    channel.setParent(category.id);
                })
            }
        }
    }
}
function createPrivateChats(msg, type, amt) {
    var cat = getCategory(type);
    if (WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            for (var i = 0; i < amt; i++) {
                guild.channels.create(`${cat}-private-${i+1}`).then(channel => {
                    channel.setParent(category.id);
                })
            }
        }
    }
}
function clearPlayerChats(msg, type) {
    var cat = getCategory(type);
    if (WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {

            var channels = category.children.array();
            for (var i = 0; i < channels.length; i++) {                
                channels[i].delete();
            }
        }
    }
}

client.login(process.env.TOKEN);