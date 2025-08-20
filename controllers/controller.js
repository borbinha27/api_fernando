import User from '../models/User.js';

export const getAllDados = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

export const addUsuario = async (req, res) => {
    const { nome, idade, profissao } = req.body;
    
    const newUser = new User({
        nome,
        idade,
        profissao
    });

    const savedUser = await newUser.save();
    res.json(savedUser);
};

export const getUsuarioById = async (req, res) => {
    const user = await User.findById(req.params.id);
    res.json(user);
};