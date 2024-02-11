const Conversation = require('../models/coversation');
const Message = require('../models/message');
const User = require("../models/user")

exports.createMessage = async (req, res, next) => {

    const content = req.body.content;
    const sender = req.email;
    const recievr = req.body.email;
    const conversationId = req.body.conversationId;
    const type = req.body.type

    try {
        const newMessage = new Message({
            ConversationId: conversationId,
            sender: sender,
            receiver: recievr,
            content: content,
            type: type
        });
        const message = await newMessage.save();
        return res.status(200).json({ message: message });
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
}

exports.getMessages = async (req, res, next) => {
    const friend = req.query.friend;
    const self = req.email;
    try {
        const conversation = await Conversation.findOne({ $or: [{ members: [self, friend] }, { members: [friend, self] }] });
        if (conversation) {
            conversation_id = conversation._id;
            const messages = await Message.find({ ConversationId: conversation_id }).select('sender receiver content type -_id');
            if (messages) {
                return res.status(200).json({ conversationId: conversation._id, messages: messages });
            } else {
                return res.status(200).json({ message: "No such user exists!" });
            }
        } else {
            return res.status(200).json({ message: "No such user exists!" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.postAttachment = async (req, res, next) => {
    const file_path = req.files.attachmentFile[0].path;
    const email = req.email;
    try {
        if (file_path) {
            let user = await User.findOne({ email: email });
            if (!user.media.includes(file_path)) {
                const newMedia = [...user.media, file_path]
                user.media = newMedia
                await user.save();
            }
            return res.status(200).json({ message: "File uploaded!", file_path: file_path });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}