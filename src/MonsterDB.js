"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MonsterDB {
    constructor() {
        this._db = [
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
        ];
    }
    getMonster() {
        return this._db[Math.floor(Math.random() * this._db.length)];
    }
    calculateAttack(monster) {
        return monster.minDamage + Math.floor(Math.random() * (monster.maxDamage - monster.minDamage));
    }
    calculateGold(monster) {
        return Math.floor(Math.random() * monster.maxDamage);
    }
}
exports.MonsterDB = MonsterDB;
//# sourceMappingURL=MonsterDB.js.map