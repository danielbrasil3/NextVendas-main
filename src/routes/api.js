const axios = require('axios');
const db = require('../../models/db');
const token = '';
module.exports = function (fastify, opts, done) {
    fastify.get('/v1/discord/auth', async (req, reply) => {
        const { code } = req.query;
        const DISCORD_CLIENT_ID = '1261399944833667202';
        const DISCORD_CLIENT_SECRET = '';
        const DISCORD_REDIRECT_URI = 'http://localhost:3000/api/v1/discord/auth';

        if (!code) {
            return reply.status(400).send({ error: 'No code provided' });
        }

        try {
            const { data: tokenData } = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
                client_id: DISCORD_CLIENT_ID,
                client_secret: DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                scope: 'identify guilds', 
                redirect_uri: DISCORD_REDIRECT_URI
            }), {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const { access_token: accessToken } = tokenData;

            const { data: userData } = await axios.get('https://discord.com/api/users/@me', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            /**const { data: userDataServer } = await axios.get('https://discord.com/api/users/@me/guilds', {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });*/
            //const ownerGuilds = userDataServer.filter(guild => guild.owner);
            const result = await db.finUser(userData.id);
            if(result === null){
                req.session.user = userData;
                req.session.accesstoken = accessToken;
                //req.session.guilds = ownerGuilds;
                await db.createUser(userData.id, 0, 0, 'undefined', 0, []);
                reply.redirect('/dashboard');
            }else{
                req.session.user = userData;
                req.session.accesstoken = accessToken;
                //req.session.guilds = ownerGuilds;

                reply.redirect('/dashboard');
            }
        } catch (error) {
            console.error('Failed to authenticate with Discord:', error.message);
            console.error(error);
            reply.status(500).send({ error: 'Failed to authenticate with Discord', details: error.message });
        }
    });
    fastify.get('/v1/auth/status', async (req, reply) => {
        const user = req.session.user;
        const access_token = req.session.accesstoken;

        if (user && access_token) {
            return reply.send({ loggedIn: true, user });
        } else {
            return reply.send({ loggedIn: false });
        }
    });
    fastify.get('/v1/info/guilds/:guildId', async (req, reply) => {
        const guildId = req.params.guildId;
        try {
            let iconUrl;
            const {data} = await axios.get(`https://discord.com/api/v10/guilds/${guildId}`, {
                headers: {
                  'Authorization': `Bot ${token}`
                }
              })
                const iconHash = data.icon;
                if(iconHash!=null){
                    iconUrl = `https://cdn.discordapp.com/icons/${guildId}/${iconHash}.png`;
                }else{
                    iconUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }
              return reply.send({
                id: data.id,
                name: data.name,
                icon: iconUrl,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({ error: 'Internal Server Error' });
        }
    });
    fastify.get('/v1/discord/auth/guilds', async (req, reply) => {
        const {code, guild_id} = req.query;
        const userId = req.session.user.id;
        if (!code && !guild_id) {
            return reply.status(400).send('Code and guildId not provided');
        }
        const itemDataServer = await db.finServerUser({user_id:userId});
        if(itemDataServer != null){
            if(Array.isArray(itemDataServer)){
                if(itemDataServer.length < 2){
                    const serverExists = itemDataServer.some(item => item.guild_id === guild_id);
                    if(serverExists){
                        return reply.redirect('/dashboard/servidores?=jaExisteEsseServer=true');
                    }else{
                        await db.createServerUser(userId, 0, guild_id, [], 'undefined', 'undefined', 'undefined', [], [], [], 'undefined', false, false, []);
                        const data = {
                            guild_id:guild_id
                        }
                        await db.updateUser({user_id: userId}, {$push:{servidores:data}})
                        return reply.redirect('/dashboard/servidores?=jaExisteEsseServer=false');
                    }
                }else{
                    return reply.redirect('/dashboard/servidores?=error=atingidoNumeroLimiteServidores');
                }
            }else{
                if(itemDataServer.guild_id === guild_id){
                    return reply.redirect('/dashboard/servidores?=jaExisteEsseServer=true');
                }else{
                    await db.createServerUser(userId, 0, guild_id, [], 'undefined', 'undefined', 'undefined', [], [], [], 'undefined', false, false, []);
                    const data = {
                        guild_id:guild_id
                    }
                    await db.updateUser({user_id: userId}, {$push:{servidores:data}})
                    return reply.redirect('/dashboard/servidores?=jaExisteEsseServer=false');
                }
            }
        }else{
            await db.createServerUser(userId, 0, guild_id, [], 'undefined', 'undefined', 'undefined', [], [], [], 'undefined', false, false, []);
            const data = {
                guild_id:guild_id
            }
            await db.updateUser({user_id: userId}, {$push:{servidores:data}})
            return reply.redirect('/dashboard/servidores?=jaExisteEsseServer=false');
        }
    });


    done();
};
