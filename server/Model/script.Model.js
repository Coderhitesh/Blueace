const mongoose = require('mongoose')

const ScriptSchema = new mongoose.Schema({
    headScript: {
        type: String,
        required: true
    },
    bodyScript: {
        type: String,
        required: true
    },
    footerScript: {
        type: String,
        required: true
    }
},{timestamps:true})

const Script = mongoose.model('Script', ScriptSchema);
module.exports = Script