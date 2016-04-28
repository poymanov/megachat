'use strict';

var httpServer = require('./httpServer'),
    WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({server: httpServer.httpServer}),
    connections = [],
    EventEmitter = require('events'),
    events = new EventEmitter(),
    assert = require('assert');

wss.on('connection', socket => {
    connections.push(socket);
    events.emit('connection', socket);

    socket.on('message', message => {
        try {
            try {
                message = JSON.parse(message);
            } catch (e) {
                throw new Error('Wrong message format');
            }

            assert.equal(typeof message.op === 'string', true, 'Wrong format: no operation specified');
            assert.equal(message.op.trim() !== '', true, 'Wrong format: no operation specified');

            events.emit('message', socket, message);
        } catch (e) {
            console.error(e.message, e.stack);
            socket.send(JSON.stringify({op: 'error', sourceOp: message.op, error: {message: e.message}}));
        }
    });

    socket.on('close', function() {
        let ix = connections.indexOf(socket);

        if (ix > -1) {
            let closedSocket = connections.splice(ix, 1);

            events.emit('close', closedSocket.length ? closedSocket[0] : null);
        }
    });
});

events.on('connection', () => {
    console.log('new connection');
});

events.on('message', (socket, message) => {
    console.log('new message', message);
});

events.on('close', () => {
    console.log('connection close');
});

module.exports = {
    send: (message, socket) => {
        console.log(message);
        socket.send(JSON.stringify(message), e => {
            if (e) {
                console.error(e.message, e.stack);
                socket.close();
            }
        });
    },
    broadcast: function(message, exclude) {
        connections.forEach(socket => {
            if (exclude && exclude === socket || Array.isArray(exclude) && exclude.indexOf(socket) > -1) {
                return;
            }

            this.send(message, socket);
        });
    },
    events: events
};
