module.exports = function (fastify, opts, done) {
    fastify.get('/user', async function (request, reply) {
        return reply.send({hello: 'hello'})
    })

    fastify.get('/', async function (request, reply) {
        return reply.view('index')
    })

    done()
}