let { users } = require('../data/db.json');
const { writeDataToFile } = require('../utils');

const dbFile = './data/db.json';

const findAll = () => {
    return new Promise((resolve, reject) => {
        resolve(JSON.stringify(users));
    });
}

const findById = id => {
    return new Promise((resolve, reject) => {
        const user = users.find(user => user.id === id);
        resolve(JSON.stringify(user));
    });
}

const create = user => {
    return new Promise((resolve, reject) => {
        const newUser = {id: Math.ceil(Math.random()*1e6), ...user}
        users.push(newUser);
        writeDataToFile(dbFile, {users});
        resolve(JSON.stringify({message: `Created user #${newUser.id}`}));
    });
}

const update = (id, user) => {
    return new Promise((resolve, reject) => {
        const modifiedUser = {id, ...user}
        users = users.map((user) => user.id === id ? modifiedUser : user);
        writeDataToFile(dbFile, {users});
        resolve(JSON.stringify({message: `Updated user #${id}`}));
    });
}

const remove = id => {
    return new Promise((resolve, reject) => {
        users = users.filter((user) => user.id !== id);
        writeDataToFile(dbFile, {users});
        resolve(JSON.stringify({message: `Deleted user #${id}`}));
    });
}

module.exports = {
    findAll,
    findById,
    create,
    update,
    remove
}