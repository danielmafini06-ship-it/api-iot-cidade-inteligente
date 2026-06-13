const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors()); 

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'smart_city_health';
let db;

async function conectarBanco() {
    await client.connect();
    db = client.db(dbName);
    console.log("🍃 Conectado com sucesso ao MongoDB!");
}
conectarBanco();

// Rota de Ingestão (Sensor POST)
app.post('/api/telemetria', async (req, res) => {
    const { geladeira_id, temperatura } = req.body;
    const agora = new Date();
    const inicioDaHora = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), agora.getHours());
    
    try {
        const colecao = db.collection('historico_vacinas');
        await colecao.updateOne(
            { geladeira_id: geladeira_id, data_hora_bucket: inicioDaHora },
            {
                $inc: { quantidade_leituras: 1 },
                $push: { leituras: { timestamp: agora, temperatura: parseFloat(temperatura) } }
            },
            { upsert: true }
        );
        res.status(201).json({ status: "Sucesso", mensagem: "Dado persistido no Bucket." });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno ao salvar no MongoDB." });
    }
});

// Rota de Busca (App GET)
app.get('/api/historico/:geladeira_id', async (req, res) => {
    const { geladeira_id } = req.params;
    try {
        const colecao = db.collection('historico_vacinas');
        const dados = await colecao.find({ geladeira_id }).sort({ data_hora_bucket: -1 }).limit(5).toArray();
        res.json(dados);
    } catch (erro) {
        res.status(500).json({ error: "Erro ao buscar histórico." });
    }
});

app.listen(3000, () => console.log('🚀 API IoT rodando em http://localhost:3000'));