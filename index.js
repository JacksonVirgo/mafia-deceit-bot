const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');

client.on('ready', () => {
    console.log(client.user.username + " is online");
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.PREFIX)) return;

    const cmdBody = message.content.slice(config.PREFIX.length);
    const args = cmdBody.split(' ');
    const command = args.shift().toLowerCase();

    console.log(`${message.author.username} sent: ${message.content}`);

    switch (command) {
        case "players":
            let arg = parseInt(args[0]);
            if (!isNaN(arg)) {
                createPlayerChats(message, message.channel.name.toLowerCase(), clamp(arg, 0, 50));
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
                createPrivateChats(message, message.channel.name.toLowerCase(), clamp(privateArg, 0, 50));
            } else {
                message.channel.send("You sent an invalid number");
            }
            break;
        case "open":
            openPlayerChats(message, message.channel.name.toLowerCase());
            break;
    }
});

function getCategory(type) {
    // "[result]-panel"
    var args = type.split('-');
    return args[0];
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function createPlayerChats(msg, type, amt) {
    var cat = getCategory(type);
    if (config.WHITELIST.includes(cat)) {
        console.log(config.WHITELIST);
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            for (var i = 0; i < amt; i++) {
                guild.channels.create(`${cat}-${i+1}`).then(channel => {
                    channel.setParent(category.id);
                })
            }
            msg.channel.send(`Created ${amt} player chats`);
        }
    }
}
function createPrivateChats(msg, type, amt) {
    var cat = getCategory(type);
    if (config.WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            for (var i = 0; i < amt; i++) {
                guild.channels.create(`${cat}-private-${i+1}`).then(channel => {
                    channel.setParent(category.id);
                })
            }
            msg.channel.send(`Created ${amt} private chats`);
        }
    }
}
function clearPlayerChats(msg, type) {
    var cat = getCategory(type);
    if (config.WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            var channels = category.children.array();
            var count = 0;
            for (var i = 0; i < channels.length; i++) {                
                channels[i].delete();
                count += 1;
            }
            msg.channel.send(`Cleared ${count} channels`);

        }
    }
}
function openPlayerChats(msg, type) {
    var cat = getCategory(type);
    if (config.WHITELIST.includes(cat)) {
        const guild = msg.guild;
        var category =  guild.channels.cache.find(c => c.name == cat && c.type == "category");
        if (category !== undefined) {
            var channels = category.children.array();
            var count = 0;
            for (var i = 0; i < channels.length; i++) {     
                channels[i].updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: true });
                count += 1;
            }
            msg.channel.send(`Opened ${count} channels`);

        }
    }
}
client.login(config.TOKEN);