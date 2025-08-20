import { Router } from "express";
import { getAllDados, addUsuario, getUsuarioById } from "../controllers/controller.js";

const rota = Router();

rota.get('/', getAllDados);

rota.post('/usuario', addUsuario);

rota.get('/usuario/:id', getUsuarioById);

export default rota;
