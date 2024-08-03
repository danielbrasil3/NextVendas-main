const db = require('../../models/db');
module.exports = function (fastify, opts, done) {
    fastify.get('/', async function (req, reply) {
        let uri_avatar;
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finUser(req.session.user.id);
        console.log({ user: req.session.user, accessToken: req.session.accesstoken });
        if(req.session.user.avatar){
            uri_avatar = `https://cdn.discordapp.com/avatars/${req.session.user.id}/${req.session.user.avatar}.png`
        }else{
            uri_avatar = `https://cdn.discordapp.com/embed/avatars/${req.session.user.discriminator % 5}.png`;
        }
        return reply.view('dashboard', { userData:req.session.user, dataUser:item, urlAvatar: uri_avatar})
    })
    fastify.get('/servidores', async function (req, reply) {
        let results = [];
        const dataUser = req.session.user;
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finUser(dataUser.id);
        //console.log(itemTeste);
        //const item = await db.finServerUser({user_id:req.session.user.id});
        const servidores = item.servidores;
        if(servidores!=null){
            if(Array.isArray(servidores)){
                for (const subItem of servidores) {
                    const response = await fetch(`http://localhost:3000/api/v1/info/guilds/${subItem.guild_id}`);
                    const dataServer = await response.json();
                    results.push(dataServer);
                }
            }else{
                const response = await fetch(`http://localhost:3000/api/v1/info/guilds/${servidores.guild_id}`);
                const dataServer = await response.json();
                results.push(dataServer);
            }
        }
        return reply.view('servidores', { dataServerUser:results});
    })
    fastify.get('/servidor/:guildId', async function (req, reply) {
        const guildId = req.params.guildId;
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finServerUser({guild_id:guildId});
        if(item!=null){
            const response = await fetch(`http://localhost:3000/api/v1/info/guilds/${guildId}`);
            const dataServer = await response.json();
            return reply.view('produtos', { userData:req.session.user, dataServer:dataServer})
        }else{
            return reply.redirect('/dashboard/servidores?=error=guildNotFound');
        }
    })
    fastify.get('/historico', async function (req, reply) {
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finUser(req.session.user.id);
        console.log({ user: req.session.user, accessToken: req.session.accesstoken });
        return reply.view('historico', { userData:req.session.user, dataUser:item})
    })
    fastify.get('/layouts', async function (req, reply) {
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finUser(req.session.user.id);
        console.log({ user: req.session.user, accessToken: req.session.accesstoken });
        return reply.view('layouts', { userData:req.session.user, dataUser:item})
    })
    fastify.get('/pagamento', async function (req, reply) {
        if (!req.session.user) {
            return reply.redirect('/');
        }
        const item = await db.finUser(req.session.user.id);
        console.log({ user: req.session.user, accessToken: req.session.accesstoken });
        return reply.view('pagamento', { userData:req.session.user, dataUser:item})
    })
    fastify.get('/sair', async function (req, reply) {
        if (!req.session.user) {
            return reply.redirect('/');
        }
        await req.session.destroy(); 
        reply.redirect('/');

    })


    done()
}