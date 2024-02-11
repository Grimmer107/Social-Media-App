const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = Schema({
    ConversationId: {
        type: Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: String,
        required: true
    },
    receiver: {
        type: String,
        required: true
    },
    content: {
        type: Schema.Types.Mixed,
        required: true
    },
    type: {
        type: String,
        required: true
    }
});


module.exports = mongoose.model('Message', MessageSchema);