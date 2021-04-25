function createChannel(guild, categoryName, channelName) {
    let category = getCategory(guild, categoryName);
    if (category) guild.channels.create(channelName).then((channel) => channel.setParent(category.id));
    else return false;
    return true;
}
function createCategory(guild, categoryName) {
    guild.channels.create(categoryName, {
        type: 'category',
    });
}
function getCategory(guild, categoryName) {
    console.log(guild);
    return guild.channels.cache.find((c) => c.name === categoryName && c.type === 'category');
}
module.exports = {
    getCategory,
    createCategory,
    createChannel,
};
