import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../../Parts/Header/header';
import Chat from '../../Parts/ChatSection/chat';
import Contacts from '../../Parts/ContactSection/contactsSection';
import Media from '../../Parts/MediaSection/media';
import Classes from './main.module.css';
import Context from '../../Context/context';

import { io } from 'socket.io-client';

const token = localStorage.getItem('token');
const expiryDate = localStorage.getItem('expiryDate');
const userId = localStorage.getItem('email');

const socket = io.connect('ws://localhost:8900');

const Main = () => {

    let navigate = useNavigate();

    const [contactFlag, setContactFlag] = useState(false);
    const [currentContact, setCurrentContact] = useState({name: "", email: "", image: ""});


    useEffect(() => {

        socket.emit('add_user', userId);
        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }
    }, []);

    return (
        <div className={Classes.App}>
            <Context.Provider value={{ contactFlag, setContactFlag }}>
                <div><Header /></div>
            </Context.Provider>
            <div className={Classes.body}>
                <Context.Provider value={{ contactFlag, setContactFlag, currentContact, setCurrentContact }}>
                    <div className={Classes.Contacts}><Contacts /></div>
                </Context.Provider>
                <Context.Provider value={{ currentContact, setCurrentContact }}>
                    <div className={Classes.Chat}><Chat /></div>
                </Context.Provider>
                <div className={Classes.Media}><Media /></div>
                {/* <div className={Classes.shape1}></div>
                <div className={Classes.shape2}></div> */}
            </div>
        </div>
    );
};

export default Main;