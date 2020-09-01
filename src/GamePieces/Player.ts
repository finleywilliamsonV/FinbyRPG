import { ML } from './../utility/MasterLogger'

export class Player {

    private _user: string
    private _userID: string
    private _level: number
    private _health: number
    private _gold: number
    private _exp: number

    constructor(user: string, userID: string) {
        this._user = user
        this._userID = userID
        this._level = 1
        this._health = 100
        this._gold = 0
        this._exp = 0
    }

    public getExpUntilNextLevel(): number {
        return Math.pow(2, this.level) * 25
    }

    public isDead(): boolean {
        return this.health <= 0
    }

    public earnExperience(exp: number): void {
        const expUntilNextLevel = this.getExpUntilNextLevel()
        this._exp += exp
        if (this._exp >= expUntilNextLevel) {
            this._level ++
            this._exp = this._exp - expUntilNextLevel
            ML.log('YOU LEVELED UP! NOW LEVEL ' + this._level)
        }
    }

    public earnGold(gold: number): void {
        this._gold += gold
    }

    public heal(): void {
        this._health = 100
    }

    public takeDamage(damage: number): void {
        this._health -= damage
        if (this._health <= 0) {
            this._health = 0
            ML.log('YOU DIED')

            if (this._level > 1) {
                this._level --
                ML.log('YOU LOST A LEVEL')
            }
        }
    }

    // GETTERS
    public get user(): string {
        return this._user
    }
    public get userID(): string {
        return this._userID
    }
    public get level(): number {
        return this._level
    }
    public get health(): number {
        return this._health
    }
    public get gold(): number {
        return this._gold
    }
    public get exp(): number {
        return this._exp
    }
}