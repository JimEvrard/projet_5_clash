import mongoose from 'mongoose';


const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    pseudo: String,
    mdp: String,
    array_personages: Array,
});

const User = mongoose.model('User', userSchema);

export default User;
