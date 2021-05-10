const User = require('../models/userModel');
const { getPostData } = require('../utils');

const getUsers = async (req, res) => {
    try {
        const users = await User.findAll();

        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(JSON.stringify(users));
    } catch (err) {
        console.log(err);
    }
}

const getUser = async (req, res, id) => {
    try {
        const user = await User.findById(id);

        if(!user) {
            res.writeHead(404, {'Content-type': 'application/json'});
            res.end(JSON.stringify({message: `User #${id} not found`}));
        } else {
            res.writeHead(200, {'Content-type': 'application/json'});
            res.end(JSON.stringify(user));
        }
    } catch (err) {
        console.log(err);
    }
}

const createUser = async (req, res) => {
    try {
        const body = await getPostData(req);
        const {name, age, gpa} = JSON.parse(body);
        const user = {name, age, gpa};

        const message = await User.create(user);

        res.writeHead(201, {'Content-type': 'application/json'});
        res.end(message);
    } catch (err) {
        console.log(err);
    }
}

const updateUser = async (req, res, id) => {
    try {
        const body = await getPostData(req);
        const {name, age, gpa} = JSON.parse(body);
        const user = {name, age, gpa};

        const message = await User.update(id, user);

        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(message);
    } catch (err) {
        console.log(err);
    }
}

const deleteUser = async (req, res, id) => {
    try {
        const message = await User.remove(id);

        res.writeHead(200, {'Content-type': 'application/json'});
        res.end(message);
    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser
}