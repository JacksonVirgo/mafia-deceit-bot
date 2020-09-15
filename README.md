# mafia-deceit-bot

This discord bot is for a [Discord Mafia](https://discord.gg/pJpUWnH) server, specifically for creating and modifying player-chats for use in Mafia games.


# Host Commands
```
m!players X
```Creates X amount of player-chats, numbered from 1-X

```
m!private X
```
Creates X amount of private chats, numbered from 1-X

```
m!open
```
Opens up all player and private chats so everyone can see them.

```
m!close
```
Closes all player and private chats so only the host can see the

# Moderator Commands
The moderator is the owner of the server, who overseers all channels created to make sure of no cheating. They also designate which players are moderators.

Moderators have their own commands in which they can use.

```
m!host user_id host_type
```
User of `user_id` will be given permissions to use the host panel of `host_type`. It will attach the host to the appropriately named panel.

# Host Panels
Each host panel will be given a very specific name, this is because the permissions is given to those able to speak into those channels instead of from roles.

Host Panels are given the name `host_type-panel`. This can allow commands to manipulate channels within `host_type`. For example, `vanilla-panel` will give access to the `vanilla` category.