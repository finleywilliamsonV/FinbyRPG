import { Player } from './../GamePieces/Player'
import { ML } from './MasterLogger'
import { MonsterDB } from '../db/MonsterDB'

import Discord = require('discord.io')
import _ = require('lodash');

export type AuthJSON = {
    token: string
}

export const TRIGGER: string = 'rpg'
const TIME_BETWEEN_BOT_MESSAGES_MS: number = 1000
const BOT_OVERLOAD_MESSAGE: string = 'Please wait at least 1s between sending messages'

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

        // Initialize the PlayerDB
        this.playerDB = []

        // Initialize the MonsterDB
        this.monsterDB = new MonsterDB()

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
            ML.log(`${this.bot.username} - (${this.bot.id})`)
        })

        this.bot.on('message', (user: string, userID: string, channelID: string, message: string): void => {

            // setup metered speak function
            const botSpeak = this.setupMeteredBotSpeak(channelID)

            if (message.substring(0, TRIGGER.length) == TRIGGER) {

                let args = message.substring(TRIGGER.length + 1).split(' ')
                const cmd = args[0]

                args = args.splice(1)

                let player: Player = _.find((p: Player) => p.userID == userID)

                // check for user
                if (!player) {
                    player = new Player(user, userID)
                    this.playerDB.push(player)
                }


                switch (cmd) {
                    // !ping
                    case 'hunt': {
                        const monster = this.monsterDB.getMonster()

                        const damage = this.monsterDB.calculateAttack(monster)

                        player.takeDamage(damage)

                        if (player.isDead()) {
                            botSpeak(`**${player.user}** fought ${monster.name} and Lost... F\n- Suffered ${damage} damage`)
                        } else {
                            const gold = this.monsterDB.calculateGold(monster)
                            player.earnGold(gold)
                            player.earnExperience(monster.exp)
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
                        player.heal()
                        break
                    }
                }
            }
        })
    }

    /**
     * Returns a function that limits bot messages to 1/second
     * @param channelID 
     */
    private setupMeteredBotSpeak = (channelID: string) : (message: string) => void => {
        let timeOfLastMessage: number
        return (message: string): void => {
            if (!timeOfLastMessage) {
                timeOfLastMessage = Date.now()
            } else if (Date.now() - timeOfLastMessage < TIME_BETWEEN_BOT_MESSAGES_MS) { // too quick
                message = BOT_OVERLOAD_MESSAGE
            }
            this.bot.sendMessage({
                to: channelID,
                message: message
            })
            timeOfLastMessage = Date.now()
        }
    } 
}

