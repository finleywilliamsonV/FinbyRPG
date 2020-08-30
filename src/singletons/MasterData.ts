import { MonsterDB } from '../db/MonsterDB';
import { PlayerDB } from "../db/PlayerDB"

export type MasterData = {
    Players: PlayerDB,
    Monsters: MonsterDB
}

export const MD: MasterData = (() => {

    let playerDB: PlayerDB
    let monsterDB: MonsterDB

    return {

        get Players(): PlayerDB {
            if (!playerDB) {
                playerDB = new PlayerDB()
            }
            return playerDB
        },

        get Monsters(): MonsterDB {
            if (!monsterDB) {
                monsterDB = new MonsterDB()
            }
            return monsterDB
        } 
     }
})()