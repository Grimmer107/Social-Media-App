const User = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');

exports.login = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email });
        if (user) {
            const doesMatch = await bcrypt.compare(password, user.password);
            if (doesMatch) {
                const token = jwt.sign({
                    name: user.name,
                    email: email,
                    password: password
                }, '&Quantum$Leap@123%', { expiresIn: '10h' });
                return res.status(200).json({ message: 'User logged in!', name: user.name, email: user.email, token: token });
            } else {
                return res.status(400).json({ message: 'Invalid username or password' });
            }
        } else {
            return res.status(400).json({ message: 'Invalid username or password' });
        }
    }
    catch (err) {
        console.log(err)
        return res.status(500).json({ error: err });
    }

};

exports.signup = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const profile_picture = req.files.profilePic[0].path
    try {
        const hashedPassword = await bcrypt.hash(password, 12)
        const newUser = new User({
            name: name,
            email: email,
            password: hashedPassword,
            profile_picture: profile_picture
        });
        const user = await newUser.save();
        return res.status(201).json({ message: 'New user created!', user: user });
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
    }
}