const mongoose = require('mongoose');

const TodoSchema = mongoose.Schema({
    title: String,
    desc: String

}, {
    timestamps: true
});

module.exports = mongoose.model('Todos', TodoSchema);
