"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(user, userID) {
        this._user = user;
        this._userID = userID;
        this._level = 1;
        this._health = 100;
        this._gold = 0;
        this._exp = 0;
    }
    getExpUntilNextLevel() {
        return Math.pow(2, this.level) * 25;
    }
    isDead() {
        return this.health <= 0;
    }
    get user() {
        return this._user;
    }
    set user(value) {
        this._user = value;
    }
    get userID() {
        return this._userID;
    }
    set userID(value) {
        this._userID = value;
    }
    get level() {
        return this._level;
    }
    set level(value) {
        this._level = value;
    }
    get health() {
        return this._health;
    }
    set health(value) {
        this._health = value;
    }
    get gold() {
        return this._gold;
    }
    set gold(value) {
        this._gold = value;
    }
    get exp() {
        return this._exp;
    }
    set exp(value) {
        const expUntilNextLevel = this.getExpUntilNextLevel();
        if (value > expUntilNextLevel) {
            this.level++;
            this._exp = value - expUntilNextLevel;
        }
        else {
            this._exp = value;
        }
    }
}
exports.Player = Player;
//# sourceMappingURL=Player.js.map