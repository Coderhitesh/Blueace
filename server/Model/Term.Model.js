const mongoose = require('mongoose')

const TermSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        enum: ['privacy','term']
    },
    content: {
        type: String,
        required: true
    }
})

const Term = mongoose.model('Term',TermSchema)
module.exports = Term;