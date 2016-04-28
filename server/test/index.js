'use strict';

let chai = require('chai'),
    url = 'ws://localhost:5000/',
    Client = require('../../megachat/src/lib/client'),
    client1 = new Client(url, 'smelukov', 'Сергей Мелюков'),
    client2 = new Client(url, 'litkov', 'Андрей Литков');

chai.should();

global.WebSocket = function(url) {
    return require('ws').createConnection(url);
};

describe('Chat client', () => {
    it('should connect', done => {
        client1.socket.connect().then(()=>done(), ()=>done(new Error('Connection failed')));
    });

    it('should register', done => {
        client1.socket.connect().then(() => {
            return new Promise(resolve => {
                client1.socket.events.on('message<-reg', (e, data) => {
                    data.should.contain.all.keys('token', 'messages', 'users');
                    data.should.not.contain.property('error');
                    data.token.should.not.empty;
                    data.messages.should.be.instanceof(Array);
                    data.users.should.be.instanceof(Array);
                    resolve();
                });

                client1.model.register();
            });
        }).then(() => done(), e=>done(e));
    });

    it('should broadcast login notification', done => {
        client2.socket.connect().then(() => {
            return new Promise(resolve => {
                client1.socket.events.on('message-user-enter', (e, data) => {
                    data.should.contain.all.keys('user');
                    data.user.login.should.be.equal('litkov');
                    data.user.name.should.be.equal('Андрей Литков');
                    resolve();
                });

                client2.model.register();
            });
        }).then(() => done(), e=>done(e));
    });

    it('should broadcast message notification', done => {
        Promise.all([
            new Promise(resolve => {
                client1.socket.events.on('message-message', (e, data) => {
                    data.should.contain.all.keys('user', 'body', 'time');
                    data.user.should.contain.all.keys('login', 'name');
                    data.user.login.should.be.equal('smelukov');
                    data.user.name.should.be.equal('Сергей Мелюков');
                    data.body.should.be.equal('some text');
                    resolve();
                });
            }),
            new Promise(resolve => {
                client2.socket.events.on('message-message', (e, data) => {
                    data.should.contain.all.keys('user', 'body', 'time');
                    data.user.should.contain.all.keys('login', 'name');
                    data.user.login.should.be.equal('smelukov');
                    data.user.name.should.be.equal('Сергей Мелюков');
                    data.body.should.be.equal('some text');
                    resolve();
                });
            })
        ]).then(() => done(), e=>done(e));

        client1.model.say('some text');
    });

    it('should broadcast logout notification', done => {
        new Promise(resolve => {
            client1.socket.events.on('message-user-out', (e, data) => {
                data.should.contain.all.keys('user');
                data.user.should.contain.all.keys('login', 'name');
                data.user.login.should.be.equal('litkov');
                data.user.name.should.be.equal('Андрей Литков');
                resolve();
            });
        }).then(() => done(), e=>done(e));

        client2.model.logout();
    });

    it('should get old message', done => {
        return new Promise(resolve => {
            client2.socket.events.on('message<-reg', (e, data) => {
                data.messages = data.messages.map(m => {
                    delete m.time;
                    return m;
                });
                
                data.messages.should.deep.include.members([{
                    body: 'some text',
                    user: {login: 'smelukov', name: 'Сергей Мелюков'}
                }]);

                resolve();
            });

            client2.model.register();
        }).then(() => done(), e=>done(e));
    });
});
