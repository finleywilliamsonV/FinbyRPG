var Discord = require('discord.io')
var logger = require('winston')
var auth = require('./auth.json')

var Player = require('./Player')
var MonsterDB = require('./MonsterDB')

// LODASH
var _ = require('lodash/core')


// get command line arguments
var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});

logger.level = 'debug';

function log(text) {
    logger.info(text)
}

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});


// player database
const PlayerDB = []

bot.on('message', function (user, userID, channelID, message, evt) {
    logger.info('// MESSAGE RECEIVED //');

    var TRIGGER = 'rpg'
    
    if (message.substring(0, TRIGGER.length) == TRIGGER) {
        logger.info('Message:' + message);
        logger.info('user:' + user);
        logger.info('userID:' + userID);

        var args = message.substring(TRIGGER.length + 1).split(' ');
        var cmd = args[0];
        
        
        logger.info('args:' + args);
        
        args = args.splice(1);
        logger.info('cmd:' + cmd);

        function botSpeak(message) {
            bot.sendMessage({
                to: channelID,
                message: message
            });
        }

        var monsterDB = new MonsterDB();

        // 

        let player

        for (let i = 0; i < PlayerDB.length; i++) {
            let currentPlayer = PlayerDB[i]
            log('currentPlayer: ' + currentPlayer)
            if (currentPlayer.userID == userID) {
                player = currentPlayer
                break
            }
        }

        log('player: ' + player)

        // check for user
        if (!player) {
            log('Adding Player: ' + user + ' - ' + userID)
            player = new Player(user, userID)
            PlayerDB.push(player)
            log(PlayerDB)
        } else {
            log(`Found Player: ${player.user} - ${player.userID}`)
        }


        switch (cmd) {
            // !ping
            case 'hunt':
                const monster = monsterDB.getMonster()

                const damage = monsterDB.calculateAttack(monster)

                player.health -= damage

                if (player.dead()) {
                    botSpeak(`**${player.user}** fought ${monster.name} and Lost... F\n- Suffered ${damage} damage`)
                } else {
                    const gold = monsterDB.calculateGold(monster)
                    log('gold: ' + gold)
                    player.gold += parseInt(gold)
                    player.exp += parseInt(monster.exp)
                    botSpeak(`**${player.user}** fought ${monster.name} and won!\n- Suffered ${damage} damage\n- Gained ${gold} gold\n- Earned ${monster.exp} experience points\n- ${player.health} health remaining`)
                }
                break;
            
            case 'p':
                botSpeak(`User: ${player.user}\n- Level: ${player.level}\n- Health: ${player.health}\n- Gold: ${player.gold}\n- Exp: ${player.exp}/${player.getExpUntilNextLevel()}`)
                break

            case 'heal':
                botSpeak('Your health has been restored to 100')
                player.health = 100
                break
        }
    }
});