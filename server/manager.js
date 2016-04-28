'use strict';

let users = [],
    assert = require('assert'),
    crypto = require('crypto');


module.exports = {
    addUser(userData, socket) {
        assert.equal(!!(typeof userData === 'object' && userData), true, 'Wrong format: no info specified');

        assert.equal(typeof userData.name === 'string', true, 'Wrong format: no name specified');
        assert.equal(userData.name.trim() !== '', true, 'Wrong format: no name specified');

        assert.equal(typeof userData.login === 'string', true, 'Wrong format: no login specified');
        assert.equal(userData.login.trim() !== '', true, 'Wrong format: no login specified');
        assert.equal(/^[\w\d\-_]+?$/.test(userData.login), true, 'Login has wrong format');

        let userExists = users.some(user => {
            return user.login === userData.login;
        });

        assert.equal(userExists, false, 'User already register');

        let token = crypto.randomBytes(64).toString('hex');

        users.push({login: userData.login, name: userData.name, token: token, socket: socket});

        return token;
    },
    isTokenValid(token){
        return !!this.getUser('token', token);
    },
    getUser(by, val) {
        for (let i = 0; i < users.length; i++) {
            if (users[i][by] === val) {
                return users[i];
            }
        }
    },
    allUsers(){
        return users;
    },
    removeUser(by, val) {
        for (let i = 0; i < users.length; i++) {
            if (users[i][by] === val) {
                return users.splice(i, 1)[0];
            }
        }
    },
    findRoom(name) {
        for (var i = 0; i < this.rooms.length; i++) {
            if (this.rooms[i].getName() === name) {
                return this.rooms[i]
            }
        }
    }
};
