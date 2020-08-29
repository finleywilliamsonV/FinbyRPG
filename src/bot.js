"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger = require('winston');
const Discord = require('discord.io');
const auth = require('./auth.json');
const Player_1 = require("./Player");
const MonsterDB_1 = require("./MonsterDB");
const _ = require('lodash/core');
const myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
function log(text) {
    logger.info(text);
}
const bot = new Discord.Client({
    token: auth.token,
    autorun: true
});
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});
const PlayerDB = [];
bot.on('message', function (user, userID, channelID, message, evt) {
    logger.info('// MESSAGE RECEIVED //');
    const TRIGGER = 'rpg';
    if (message.substring(0, TRIGGER.length) == TRIGGER) {
        logger.info('Message:' + message);
        logger.info('user:' + user);
        logger.info('userID:' + userID);
        let args = message.substring(TRIGGER.length + 1).split(' ');
        const cmd = args[0];
        logger.info('args:' + args);
        args = args.splice(1);
        logger.info('cmd:' + cmd);
        function botSpeak(message) {
            bot.sendMessage({
                to: channelID,
                message: message
            });
        }
        const monsterDB = new MonsterDB_1.MonsterDB();
        let player;
        for (let i = 0; i < PlayerDB.length; i++) {
            let currentPlayer = PlayerDB[i];
            log('currentPlayer: ' + currentPlayer);
            if (currentPlayer.userID == userID) {
                player = currentPlayer;
                break;
            }
        }
        log('player: ' + player);
        if (!player) {
            log('Adding Player: ' + user + ' - ' + userID);
            player = new Player_1.Player(user, userID);
            PlayerDB.push(player);
            log(PlayerDB.toString());
        }
        else {
            log(`Found Player: ${player.user} - ${player.userID}`);
        }
        switch (cmd) {
            case 'hunt':
                const monster = monsterDB.getMonster();
                const damage = monsterDB.calculateAttack(monster);
                player.health -= damage;
                if (player.isDead()) {
                    botSpeak(`**${player.user}** fought ${monster.name} and Lost... F\n- Suffered ${damage} damage`);
                }
                else {
                    const gold = monsterDB.calculateGold(monster);
                    log('gold: ' + gold);
                    player.gold += gold;
                    player.exp += monster.exp;
                    botSpeak(`**${player.user}** fought ${monster.name} and won!\n- Suffered ${damage} damage\n- Gained ${gold} gold\n- Earned ${monster.exp} experience points\n- ${player.health} health remaining`);
                }
                break;
            case 'p':
                botSpeak(`User: ${player.user}\n- Level: ${player.level}\n- Health: ${player.health}\n- Gold: ${player.gold}\n- Exp: ${player.exp}/${player.getExpUntilNextLevel()}`);
                break;
            case 'heal':
                botSpeak('Your health has been restored to 100');
                player.health = 100;
                break;
        }
    }
});
//# sourceMappingURL=bot.js.map