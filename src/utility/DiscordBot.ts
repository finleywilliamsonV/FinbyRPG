import { MonsterDB } from './../MonsterDB';
import { Player } from './../Player';
import { Logger } from './Logger';
const Discord = require('discord.io')

export type DiscordClient = any
export type AuthJSON = {
    token: string
}

export class DiscordBot {

    private bot: DiscordClient
    private auth: AuthJSON = require('../../auth.json')
    private logger: Logger
    private playerDB: Player[]
    private monsterDB: MonsterDB

    constructor() {

        // Initialize Logger
        this.logger = new Logger()

        // Initialize Discord Bot
        this.bot = new Discord.Client({
            token: this.auth.token,
            autorun: true
        });

        // Set Bot Listeners
        this.setBotListeners()

        // Initialize player database
        this.playerDB = []

        // Initialize Monster Database
        this.monsterDB = new MonsterDB();
    }

    private setBotListeners = (): void => {
        this.bot.on('ready', (evt: Event) => {
            this.logger.log('Connected');
            this.logger.log('Logged in as: ');
            this.logger.log(this.bot.username + ' - (' + this.bot.id + ')');
        });

        this.bot.on('message', (user: string, userID: string, channelID: string, message: string,  evt: Event): void => {
            this.logger.log('// MESSAGE RECEIVED //');
        
            const TRIGGER: string = 'rpg'
            
            if (message.substring(0, TRIGGER.length) == TRIGGER) {
                this.logger.log('Message:' + message);
                this.logger.log('user:' + user);
                this.logger.log('userID:' + userID);
        
                let args = message.substring(TRIGGER.length + 1).split(' ');
                const cmd = args[0];
                
                
                this.logger.log('args:' + args);
                
                args = args.splice(1);
                this.logger.log('cmd:' + cmd);
        
                const botSpeak = (message: string): void => {
                    this.bot.sendMessage({
                        to: channelID,
                        message: message
                    });
                }
        
                let player
        
                for (let i = 0; i < this.playerDB.length; i++) {
                    let currentPlayer = this.playerDB[i]
                    this.logger.log('currentPlayer: ' + currentPlayer)
                    if (currentPlayer.userID == userID) {
                        player = currentPlayer
                        break
                    }
                }
        
                this.logger.log('player: ' + player)
        
                // check for user
                if (!player) {
                    this.logger.log('Adding Player: ' + user + ' - ' + userID)
                    player = new Player(user, userID)
                    this.playerDB.push(player)
                    this.logger.log(this.playerDB.toString())
                } else {
                    this.logger.log(`Found Player: ${player.user} - ${player.userID}`)
                }
        
        
                switch (cmd) {
                    // !ping
                    case 'hunt':
                        const monster = this.monsterDB.getMonster()
        
                        const damage = this.monsterDB.calculateAttack(monster)
        
                        player.health -= damage
        
                        if (player.isDead()) {
                            botSpeak(`**${player.user}** fought ${monster.name} and Lost... F\n- Suffered ${damage} damage`)
                        } else {
                            const gold = this.monsterDB.calculateGold(monster)
                            this.logger.log('gold: ' + gold)
                            player.gold += gold
                            player.exp += monster.exp
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
    }
}

