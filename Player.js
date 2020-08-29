
class Player {

    _user
    _userID
    _level
    _health
    _gold
    _exp

    constructor(user, userID) {
        this.user = user
        this.userID = userID
        this.level = 1
        this.health = 100
        this.gold = 0
        this.exp = 0
    }

    getExpUntilNextLevel() {
        return Math.pow(2, this.level) * 25
    }

    dead() {
        return this.health <= 0
    }




    // GETTERS AND SETTERS
    get user() {
        return this._user
    }
    set user(value) {
        this._user = value
    }
    get userID() {
        return this._userID
    }
    set userID(value) {
        this._userID = value
    }
    get level() {
        return this._level
    }
    set level(value) {
        this._level = value
    }
    get health() {
        return this._health
    }
    set health(value) {
        this._health = value
    }
    get gold() {
        return this._gold
    }
    set gold(value) {
        this._gold = value
    }
    get exp() {
        return this._exp
    }
    set exp(value) {
        const expUntilNextLevel = this.getExpUntilNextLevel()
        if (value > expUntilNextLevel) {
            this.level ++
            this._exp = value - expUntilNextLevel
        } else {
            this._exp = value
        }
    }
}

module.exports = Player