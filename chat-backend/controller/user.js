const path = require('path');
const User = require('../models/user');
const Conversation = require('../models/coversation');
const Message = require('../models/message');

exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        const currentUser = await User.findOne({ email: req.email });
        if (users && currentUser) {
            const OtherUsers = users.filter((user) => user.email !== req.email);
            const contactNames = currentUser.contacts.map((user) => {
                return user.email;
            })
            const filteredUsers = OtherUsers.filter(item => !contactNames.includes(item.email));
            const userdata = filteredUsers.map((user) => {
                return { name: user.name, email: user.email };
            })
            return res.status(200).json({ message: "Make new friends", users: userdata });
        } else {
            return res.status(200).json({ message: "You are all alone in this world!" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const data = await User.findOne({ email: req.email }).select('contacts -_id');
        if (data.contacts) {
            const contacts = await Promise.all(data.contacts.map(async (contact) => {
                let conversation = await Conversation.findOne({ $or: [{ members: [req.email, contact.email] }, { members: [contact.email, req.email] }] });
                if (conversation) {
                    let messages = await Message.find({ ConversationId: conversation._id }).select('sender receiver content type -_id');
                    if (messages && messages.length > 0) {
                        let lastMessage = messages[messages.length - 1]
                        return { name: contact.name, email: contact.email, sender: lastMessage.sender, lastMessage: lastMessage.content, type: lastMessage.type }
                    } else {
                        return { name: contact.name, email: contact.email, sender: "", lastMessage: "", type: "" }
                    }

                } else {
                    return { name: contact.name, email: contact.email, sender: "", lastMessage: "", type: "" }
                }
            }))

            return res.status(200).json({ contacts: contacts });
        } else {
            return res.status(200).json({ message: "You are all alone in this world!" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
};

exports.addContact = async (req, res, next) => {
    try {
        const email = req.body.email;
        const name = req.body.name;
        const user = await User.findOne({ email: req.email });
        if (user) {
            const contacts = user.contacts;
            const newContacts = [...contacts];
            newContacts.push({ name: name, email: email });
            user.contacts = newContacts;
            const newuser = await user.save();
            if (newuser) {
                const Otheruser = await User.findOne({ email: email });
                const Othercontacts = Otheruser.contacts;
                const OthernewContacts = [...Othercontacts];
                OthernewContacts.push({ name: req.name, email: req.email });
                Otheruser.contacts = OthernewContacts;
                await Otheruser.save();
                if (Otheruser) {
                    const newConversation = new Conversation({ members: [req.email, email] });
                    const conversation = await newConversation.save();
                    return res.status(200).json({ message: "You have a new friend!", conversationId: conversation._id });
                } else {
                    return res.status(200).json({ message: "No such user exists!" });
                }
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

exports.getDetails = async (req, res, next) => {
    try {
        let email = req.email;
        if (req.query.email) {
            email = req.query.email;
        }
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(200).json({ userDetails: user });
        } else {
            return res.status(200).json({ message: "No such user exists!" });
        }
    } catch (err) {
        return res.status(500).json(err);
    }
}

exports.getImage = async (req, res, next) => {
    try {
        let filePath = req.query.path;
        filePath = filePath.replace(/\134/g, "/");
        res.send({ image: filePath });
        res.status = 200;
        res.end();
    } catch (err) {
        return res.status(500).json(err);
    }
}