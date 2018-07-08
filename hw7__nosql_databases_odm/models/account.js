import {users} from '../config/users.json';

export function findUserByName(username, callback) {
    const currentUser = users
        .find(user => user.username === username);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error('User not found!'));
    }
}

export function findUserById(type, id, callback) {
    const currentUser = users
        .find(user => user.id === id);

    if (currentUser) {
        callback(null, currentUser);
    } else {
        callback(new Error(`${type.toUpperCase()} User not found!`));
    }
}