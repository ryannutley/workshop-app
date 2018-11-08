'use strict';
const Hapi   = require('hapi');
const Server = new Hapi.Server();
const Hello  = require('./lib/hello');
const tracer = require('dd-trace').init()

const span = tracer.startSpan('web.request')

span.setTag('my_tag', 'my_value')


Server.connection({ port: 3000 });

Server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: function (request, reply) {

        const result = Hello(decodeURIComponent(request.params.user));
        span.finish()
        reply(result);
    }
});

// don't start server if this file was required

if (!module.parent) {

    Server.start((err) => {

        if (err) {
            throw err;
        }
        console.log(`Server running at: ${Server.info.uri}`);
    });
}

module.exports = Server;
