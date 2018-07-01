var bcrypt = require('bcrypt');
const saltRounds = 10;
const salt = 'anySalt';
const myPlaintextPassword = '12345678';
const someOtherPlaintextPassword = 'wrong_password';

export default class CryptHandler {
    constructor() {
        this.saltRounds = saltRounds;
        this.salt = salt;
    }

    genSalt(saltRounds) {
        return new Promise((res, rej) => {
            try {
                bcrypt.genSalt(saltRounds, (err, salt) => {
                    this.salt = salt;
                    res(salt);
                });
            } catch (err) {
                rej(err);
            }
        });
    }

    get(password) {
        return new Promise((res, rej) => {
            try {
                bcrypt.hash(password, this.salt, (err, hash) => {
                    res(hash);
                });
            } catch (err) {
                rej(err);
            }
        });
    }

    verify(plainPassword, comparedHash) {
        return new Promise((res, rej) => {
            try {
                bcrypt.compare(plainPassword, comparedHash, (err, isEquel) => {
                    res(isEquel);
                });
            } catch (err) {
                rej(err);
            }
        });
    }
}
