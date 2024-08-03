const Fastify = require('fastify');
const ejs = require('ejs');
const fastifyView = require('@fastify/view');
const path = require('path');
const fastifyStatic = require('@fastify/static');
const fastify = Fastify({ logger: false });
const fastifySession = require('fastify-session');
const fastifyCookie = require('fastify-cookie');
fastify.register(fastifyStatic, {
  root: path.join(__dirname, 'public'),
  prefix: '/public/',
});
fastify.register(fastifyView, {
  engine: {
      ejs: ejs,
  },
  root:path.join(__dirname, 'public', 'templates'),
  viewExt: 'ejs'
});
fastify.register(fastifyCookie);
fastify.register(fastifySession, {
    secret: 'dcta478j-196l-03fm-t6gh-4298er7845m2',
    cookie: { 
      secure: false,
      maxAge: 3600 * 1000
    },
});
fastify.register(require('./src/routes/index'));
fastify.register(require('./src/routes/api'), { prefix: 'api' });
fastify.register(require('./src/routes/dashboard'), { prefix: 'dashboard' });

fastify.listen(3000, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor escutando em ${address}`);
});
