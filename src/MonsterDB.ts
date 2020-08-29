export type Monster = {
    name: string,
    exp: number,
    minDamage: number,
    maxDamage: number
}

export class MonsterDB {

    _db: Monster[] = [
        {
            'name': 'an ugly bird',
            'exp': 23,
            'minDamage': 10,
            'maxDamage': 25
        },
        {
            'name': 'seventeen children',
            'exp': 17,
            'minDamage': 40,
            'maxDamage': 55
        },
        {
            'name': 'a wild lemon',
            'exp': 2,
            'minDamage': 1,
            'maxDamage': 7
        },
        {
            'name': 'bees',
            'exp': 32,
            'minDamage': 20,
            'maxDamage': 30
        }
    ]

    constructor() {}

    getMonster() {
        return this._db[Math.floor(Math.random() * this._db.length)]
    }

    calculateAttack(monster: Monster) {
        return monster.minDamage + Math.floor(Math.random() * (monster.maxDamage - monster.minDamage))
    }

    calculateGold(monster: Monster) {
        return Math.floor(Math.random() * monster.maxDamage)
    }
}