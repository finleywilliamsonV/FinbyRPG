
import { ML } from './Logger'
import { MonsterDB } from '../db/MonsterDB'
import { Player } from '../GamePieces/Player'
import Discord = require('discord.io')

export type AuthJSON = {
    token: string
}

/**
 * Class DiscordBot
 */
export class DiscordBot {

    private bot: Discord.Client
    private auth: AuthJSON = require('../../auth.json')
    private playerDB: Player[]
    private monsterDB: MonsterDB


    /**
     * Constructor
     */
    constructor() {

        // Initialize Discord Bot
        this.bot = new Discord.Client({
            token: this.auth.token,
            autorun: true
        })

        // Set Bot Listeners
        this.setBotListeners()
    }

    /**
     * Sets the listeners for the bot
     */
    private setBotListeners = (): void => {
        this.bot.on('ready', () => {
            ML.log('Connected')
            ML.log('Logged in as: ')
            ML.log(this.bot.username + ' - (' + this.bot.id + ')')
        })

        this.bot.on('message', (user: string, userID: string, channelID: string, message: string,  ): void => {
            ML.log('// MESSAGE RECEIVED //')
        
            const TRIGGER: string = 'rpg'

            const botSpeak = (message: string): void => {
                this.bot.sendMessage({
                    to: channelID,
                    message: message
                })
            }
            
            if (message.substring(0, TRIGGER.length) == TRIGGER) {
                ML.log('Message:' + message)
                ML.log('user:' + user)
                ML.log('userID:' + userID)
        
                let args = message.substring(TRIGGER.length + 1).split(' ')
                const cmd = args[0]
                
                ML.log('args:' + args)
                
                args = args.splice(1)
                ML.log('cmd:' + cmd)
        
                let player
        
                for (let i = 0; i < this.playerDB.length; i++) {
                    const currentPlayer = this.playerDB[i]
                    ML.log('currentPlayer: ' + currentPlayer)
                    if (currentPlayer.userID == userID) {
                        player = currentPlayer
                        break
                    }
                }
        
                ML.log('player: ' + player)
        
                // check for user
                if (!player) {
                    ML.log('Adding Player: ' + user + ' - ' + userID)
                    player = new Player(user, userID)
                    this.playerDB.push(player)
                    ML.log(this.playerDB.toString())
                } else {
                    ML.log(`Found Player: ${player.user} - ${player.userID}`)
                }
        
        
                switch (cmd) {
                    // !ping
                    case 'hunt': {
                        const monster = this.monsterDB.getMonster()
        
                        const damage = this.monsterDB.calculateAttack(monster)
        
                        player.health -= damage
        
                        if (player.isDead()) {
                            botSpeak(`**${player.user}** fought ${monster.name} and Lost... F\n- Suffered ${damage} damage`)
                        } else {
                            const gold = this.monsterDB.calculateGold(monster)
                            ML.log('gold: ' + gold)
                            player.gold += gold
                            player.exp += monster.exp
                            botSpeak(`**${player.user}** fought ${monster.name} and won!\n- Suffered ${damage} damage\n- Gained ${gold} gold\n- Earned ${monster.exp} experience points\n- ${player.health} health remaining`)
                        }
                        break
                    }

                    case 'p': {
                        botSpeak(`User: ${player.user}\n- Level: ${player.level}\n- Health: ${player.health}\n- Gold: ${player.gold}\n- Exp: ${player.exp}/${player.getExpUntilNextLevel()}`)
                        break
                    }

                    case 'heal': {
                        botSpeak('Your health has been restored to 100')
                        player.health = 100
                        break
                    }
                }
            }
        })
    }
}

