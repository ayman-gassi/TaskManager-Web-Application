import mongoose from 'mongoose';const Schema = mongoose.Schema;
const conversationSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true
    },
    messages: [
        {
            sender: {
                type: String,
                enum: ['user', 'bot'],
                required: true
            },
            message: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, {
    timestamps: true
});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;