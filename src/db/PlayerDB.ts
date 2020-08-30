import { Player } from '../GamePieces/Player';
import * as _ from 'lodash' 

export class PlayerDB {

    private db: Player[]

    /**
     * Initialize Player Database
     */
    constructor() {
        this.db = []
    }

    public addPlayer(player: Player): Player[] {
        this.db.push(player)
        return this.db
    }

    public removePlayer(player: Player): Player[] {
        return _.remove(this.db, player)
    }
}