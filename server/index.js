'use strict';

var socketServer = require('./socketServer'),
    httpServer = require('./httpServer'),
    manager = require('./manager'),
    messages = [],
    fs = require('fs'),
    path = require('path'),
    assert = require('assert');

socketServer.events.on('connection', socket => {
    setTimeout(() => {
        if (!manager.getUser('socket', socket)) {
            socket.close(4000, 'Register timeout was expired');
        }
    }, 5000);
});

socketServer.events.on('close', socket => {
    let user = manager.removeUser('socket', socket);

    if (user) {
        console.log(`User ${user.login} was disconnected`);
        socketServer.broadcast({op: 'user-out', user: {name: user.name, login: user.login}});
    }
});

socketServer.events.on('message', (socket, message) => {
    switch (message.op) {
        case 'reg':
        {
            let token = manager.addUser(message.data, socket);

            console.log(`User ${message.data.login} was registered`);
            socketServer.send({
                op: 'token',
                sourceOp: message.op,
                token: token,
                messages: messages,
                users: manager.allUsers().map(u => {
                    return {name: u.name, login: u.login}
                })
            }, socket);
            socketServer.broadcast({op: 'user-enter', user: message.data}, socket);
            break;
        }
        case 'message':
        {
            let fromUser = manager.getUser('socket', socket),
                date = new Date(),
                messageTime = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds(), date.getUTCMilliseconds());

            assert.equal(manager.isTokenValid(message.token), true, 'Your token is invalid');
            assert.equal(typeof message.data.body === 'string', true, 'The message must have a body');
            assert.equal(message.data.body.trim() !== '', true, 'The message must have a body');

            message.data.body = message.data.body.substr(0, 100);

            console.log(`User ${fromUser.login} sending message...`);
            messages.push({
                user: {name: fromUser.name, login: fromUser.login},
                body: message.data.body,
                time: messageTime
            });
            messages.splice(0, messages.length - 10 < 1 ? 0 : messages.length - 10);
            socketServer.broadcast({
                op: 'message',
                user: {name: fromUser.name, login: fromUser.login},
                body: message.data.body,
                time: messageTime
            });
            break;
        }
    }
});

httpServer.events.on('upload', (fields, files) => {
    let user = manager.getUser('token', fields.token[0]),
        file = files.photo[0];

    if (!user) {
        throw new Error('User not found');
    }

    fs.writeFileSync(path.join(__dirname, `photos/${user.login}.jpg`), fs.readFileSync(file.path));
    console.log(`Photo of ${user.login} was loaded`);

    socketServer.broadcast({
        op: 'user-change-photo',
        user: {name: user.name, login: user.login}
    });
});
