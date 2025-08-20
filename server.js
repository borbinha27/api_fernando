import express from "express";
import dataRoutes from "./routers/router.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import connectDB from "./config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

connectDB();

app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use("/", dataRoutes);
app.use(express.static(join(__dirname, '.')));



app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});