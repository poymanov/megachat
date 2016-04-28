'use strict';

let httpServer = require('http').createServer().listen(5000, '0.0.0.0', () => {
        console.log(`Server started on ${httpServer.address().address}:${httpServer.address().port}`);
    }),
    EventEmitter = require('events'),
    events = new EventEmitter(),
    assert = require('assert'),
    path = require('path'),
    multiparty = require('multiparty'),
    fs = require('fs');

httpServer.on('request', (request, response) => {
    let op = request.url.match(/^\/(\S+?)(?:$|\/.*)/);

    response.setHeader('Access-Control-Allow-Origin', '*');

    console.log(op);

    if (!op) {
        response.end();
        return;
    }

    switch (op[1]) {
        case 'photos':
        {
            if (/^\/photos\//i.test(request.url)) {
                let photoName = request.url.match(/\/photos\/(\w+).*$/i);

                if (photoName) {
                    photoName = photoName[1];

                    if (/^\w+$/.test(photoName)) {
                        outPhoto(response, photoName);
                        return;
                    }
                }
            }

            outPhoto(response);
            return;
        }
        case 'upload':
        {
            if (request.method.toLowerCase() === 'post') {
                let form = new multiparty.Form();

                response.setHeader('Content-type', 'application/json; charset=utf8');

                form.parse(request, function(err, fields, files) {
                    let currentFile = files.photo && files.photo[0],
                        maxSize = 512 * 1024;

                    try {
                        assert.equal(currentFile !== undefined, true, 'File not specified');
                        assert.equal(/^\.jpe?g$/i.test(path.extname(currentFile.path)), true, 'Only jpg is allowed');
                        assert.equal(currentFile.size <= maxSize, true, `Max file size is ${maxSize}kb`);

                        events.emit('upload', fields, files);

                        response.end(JSON.stringify({ok: true}));
                    } catch (e) {
                        response.end(JSON.stringify({error: {message: e.message}}));
                    }
                });
            }
            break;
        }
        default:
            response.end();
    }
});

module.exports = {
    httpServer: httpServer,
    events: events
};

let parsePost = req => {
        return new Promise(resolve => {
            var data = '';

            req.on('data', chunk => {
                data += chunk;
            });
            req.on('end', () => {
                resolve(data);
            });
        });
    },
    outPhoto = (response, photoName) => {
        let fName = path.join(__dirname, 'photos', `${photoName}.jpg`),
            notFoundName = path.join(__dirname, 'no-photo.jpg');

        response.setHeader('Content-type', 'image/jpg');

        if (fName && fs.existsSync(fName)) {
            response.end(fs.readFileSync(fName));
        } else {
            response.end(fs.readFileSync(notFoundName));
        }
    };


