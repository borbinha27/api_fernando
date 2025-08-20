import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    profissao: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);

export default User;