const { MongoClient } = require("mongodb");
const uri = "";

let client;
let db;

async function connectDB() {
    if (!db) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db('nextpayments');
    }
}

async function createUser(user_id, saldo, vendas_hoje, chave_pix, total_vendas, servidores) {
    try {
        await connectDB();
        const users = db.collection('users');
        const res = await users.insertOne({
            user_id: user_id,
            saldo: saldo,
            vendas_hoje: vendas_hoje,
            chave_pix: chave_pix,
            total_vendas: total_vendas,
            servidores: servidores
        });
        return res;
    } catch (error) {
        console.error('Failed to create user:', error.message);
        throw error;
    }
}
async function createServerUser(user_id, vendas_totais, guild_id, produtos, channelLog, roleBuyer, historico_transacao, tickets, saldo_users, aprovados, channel_notifica, fornecedor, drop, produtos_revendidos) {
    try {
        await connectDB();
        const servers = db.collection('servers');
        const res = await servers.insertOne({
            user_id: user_id,
            tickets:tickets,
            vendas_totais: vendas_totais,
            guild_id: guild_id,
            produtos: produtos,
            channelLog: channelLog,
            roleBuyer: roleBuyer,
            historico_transacao: historico_transacao,
            saldo_users: saldo_users,
            aprovados: aprovados,
            channel_notifica:channel_notifica,
            fornecedor: fornecedor,
            drop:drop,
            produtos_revendidos:produtos_revendidos
        });
        return res;
    } catch (error) {
        console.error('Failed to create user server:', error.message);
        throw error;
    }
}

async function finUser(user_id) {
    try {
        await connectDB();
        const users = db.collection('users');
        const res = await users.findOne({ user_id: user_id });
        return res;
    } catch (error) {
        console.error('Failed to find user:', error.message);
        throw error;
    }
}
async function updateUser(criteriaFilter, criteriaInsert, options = {}) {
    try {
        await connectDB();
        const servers = db.collection('users');
        const res = await servers.updateOne(criteriaFilter, criteriaInsert, options);
        return res;
    } catch (error) {
        console.error('Failed to update user:', error.message);
        throw error;
    }
}
async function updateServerUser(criteriaFilter, criteriaInsert, options = {}) {
    try {
        await connectDB();
        const servers = db.collection('servers');
        const res = await servers.updateOne(criteriaFilter, criteriaInsert, options);
        return res;
    } catch (error) {
        console.error('Failed to update user server:', error.message);
        throw error;
    }
}
async function finServerUser(criteria) {
    try {
        await connectDB();
        const servers = db.collection('servers');
        const res = await servers.findOne(criteria);
        return res;
    } catch (error) {
        console.error('Failed to find server user:', error.message);
        throw error;
    }
}


module.exports = {
    createUser,
    finUser,
    createServerUser,
    finServerUser,
    updateServerUser, 
    updateUser
};
