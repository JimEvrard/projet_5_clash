import mongoose from 'mongoose'; //


const personageSchema = new mongoose.Schema({
    name: String,
    image: String,
    level: String,
    description: String,
    attack: Number,
    defense: Number,
    life: String,
    template: String,
    template_name: String,
});

const Personage = mongoose.model('Personage', personageSchema);

export default Personage;