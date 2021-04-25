const Discord = require('discord.js');
const client = new Discord.Client();
const CommandHandler = require('./commands/CommandHandler');
const { createChannel, createCategory, getCategory } = require('./utilities/channelManager');
if (process.env.NODE_ENV || 'development') {
    require('dotenv').config();
}

const config = {
    TOKEN: process.env.TOKEN,
    PREFIX: process.env.PREFIX,
    ADMIN: process.env.ADMIN,
    PANEL: 'bl_hosting panel',
    BLACKLIST: 'bl_',
};

client.on('ready', () => {
    console.log(client.user.username + ' is online');
});

client.on('message', (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.PREFIX)) return;
    let foundCommand = CommandHandler.handleCommand(client, message, config);
    if (!foundCommand) {
        const { channel, guild } = message;
        const category = channel.parent;
        const cmdBody = message.content.slice(config.PREFIX.length);
        const args = cmdBody.split(' ');
        const command = args.shift().toLowerCase();
        const categoryChildren = {};
        category.children.forEach((val) => {
            categoryChildren[val.name] = {
                name: val.name,
                id: val.id,
            };
        });
        const validCategory = category.name === config.PANEL;

        switch (command) {
            case 'signups':
                break;
            case 'players':
                let arg = parseInt(args[0]);
                if (!isNaN(arg)) createPlayerChats(message, message.channel.name.toLowerCase(), clamp(arg, 0, 50));
                else message.channel.send('You sent an invalid number');
                break;
            case 'clear':
                if (validCategory) clearPlayerChats(message, message.channel.name.toLowerCase());
                break;
            case 'private':
                if (validCategory) {
                    let privateArg = parseInt(args[0]);
                    if (!isNaN(privateArg)) createPrivateChats(message, message.channel.name.toLowerCase(), clamp(privateArg, 0, 50));
                    else message.channel.send('You sent an invalid number');
                }
                break;
            case 'open':
                if (validCategory) openPlayerChats(message, message.channel.name.toLowerCase());
                break;
            case 'close':
                if (validCategory) closePlayerChats(message, message.channel.name.toLowerCase());
                break;
            case 'validity':
                if (validCategory) {
                    let panel = getPanel(channel.name);
                    if (panel) message.channel.send(`This channel mannages the "${panel}" panel`);
                    else message.channel.send('This channel is not a panel');
                }
                break;
            case 'panel':
                if (validCategory) {
                    if (channel.name === config.ADMIN) {
                        let panelTarget = args[0];
                        let panelTargetFull = panelTarget + '-panel';
                        if (categoryChildren[panelTargetFull]) {
                            let category = message.guild.channels.cache.find((c) => c.name == panelTarget && c.type == 'category');
                            if (category) {
                                message.channel.send('That panel already exists!');
                            } else {
                                createCategory(guild, panelTarget);
                            }
                        } else {
                            createChannel(guild, config.PANEL, panelTargetFull);
                            createCategory(guild, panelTarget);
                        }
                    }
                }
                break;
            case 'remove':
                if (args[0].startsWith(config.BLACKLIST)) message.channel.send('Attempted to access a blacklisted area');
                if (validCategory && !args[0].startsWith(config.BLACKLIST)) {
                    if (channel.name === config.ADMIN) {
                        let panelTarget = args[0];
                        let panelTargetFull = panelTarget + '-panel';
                        let category = getCategory(guild, panelTarget);
                        let panelRoot = categoryChildren[panelTargetFull];
                        if (category) {
                            let channels = category.children.array();
                            let count;
                            for (count = 0; count < channels.length; count++) channels[count].delete();
                            category.delete();
                            message.channel.send(`Removed ${count} channels and ${panelTarget} `);
                        }
                        if (panelRoot) {
                            client.channels.fetch(panelRoot.id).then((channel) => channel.delete());
                        }
                    }
                }
                break;
        }
    }
});

/**
 *
 * @param {*} panel
 * @returns panel handle or null if not a handle.
 */
function getPanel(panel) {
    let args = panel.split('-');
    return args[1] === 'panel' ? args[0] : null;
}

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num;
}

function createPlayerChats(msg, type, amt) {
    var cat = getPanel(type);
    const guild = msg.guild;
    let category = getCategory(msg.guild, cat);
    if (category !== undefined) {
        for (var i = 0; i < amt; i++) {
            guild.channels.create(`${cat}-${i + 1}`).then((channel) => {
                channel.setParent(category.id);
            });
        }
        msg.channel.send(`Created ${amt} player chats`);
    }
}
function createPrivateChats(msg, type, amt) {
    console.log('F');
    var cat = getPanel(type);
    const guild = msg.guild;
    let category = getCategory(msg.guild, cat);
    if (category !== undefined) {
        for (var i = 0; i < amt; i++) {
            guild.channels.create(`${cat}-private-${i + 1}`).then((channel) => {
                channel.setParent(category.id);
            });
        }
        msg.channel.send(`Created ${amt} private chats`);
    }
}
function clearPlayerChats(msg, type) {
    var cat = getPanel(type);
    var category = getCategory(msg.guild, cat);
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
function openPlayerChats(msg, type) {
    var cat = getPanel(type);
    var category = getCategory(msg.guild, cat);
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

function closePlayerChats(msg, type) {
    var cat = getPanel(type);
    let category = getCategory(msg.guild, cat);
    if (category !== undefined) {
        var channels = category.children.array();
        var count = 0;
        for (var i = 0; i < channels.length; i++) {
            channels[i].updateOverwrite(guild.roles.everyone, { VIEW_CHANNEL: false });
            count += 1;
        }
        msg.channel.send(`Closed ${count} channels`);
    }
}
client.login(config.TOKEN);
