import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';

import Classes from './chat.module.css';
import Message from '../../Components/Message/message';
import message_send from '../../Assets/img/message_send.png';
import attach from '../../Assets/img/icons8-attach-48.png';
import Context from '../../Context/context';

const token = localStorage.getItem('token');
const expiryDate = localStorage.getItem('expiryDate');
const username = localStorage.getItem('email');


const Chat = () => {

    const socket = useRef();
    const imageUpload = useRef(null);

    const { currentContact } = useContext(Context);

    const [feedMessages, setFeedMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [update, setUpdate] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [receivedMessage, setReceivedMessage] = useState("");

    const [currentProfileImage, setCurrentProfileImage] = useState()

    let navigate = useNavigate();

    const chatEl = useRef(null);

    useEffect(() => {

        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        axios.get(`http://localhost:8080/messages?friend=${currentContact.email}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(response => {
            setConversationId(response.data.conversationId);
            if (response.data && response.data.messages) {
                let contentFeed = response.data.messages;

                axios.get(`http://localhost:8080/details?email=${username}`, {
                    headers: {
                        Authorization: 'Bearer ' + token
                    }
                })
                .then(response => {
                    let profiler = `http://localhost:8080\\` + response.data.userDetails.profile_picture.replace(/\134/g, "/")
                    let feed = contentFeed.map((mess) => {
                        if (mess.sender === username) {
                            return { self: true, message: mess.content, image: profiler }
                        } else {
                            return { self: false, message: mess.content, image: currentContact.image }
                        }
                    })
                    setCurrentProfileImage(profiler);
                    setFeedMessages(feed);
                }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));

    }, [currentContact])


    useEffect(() => {
        socket.current = io.connect('ws://localhost:8900')
        socket.current.on('receive_message', data => {
            if (data.text) {
                if (data.senderId === username) {
                    setReceivedMessage({ self: true, message: data.text });
                }
                else if (data.receiverId === username) {
                    setReceivedMessage({ self: false, message: data.text });
                }
            }
        });
    }, [])


    useEffect(() => {
        let new_arrival = [...feedMessages, receivedMessage];
        setFeedMessages(new_arrival);
        chatEl.current.scrollIntoView({ behavior: "smooth" });
    }, [receivedMessage])


    useEffect(() => {
        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        if (newMessage !== "") {
            console.log("Send useEffect called");
            axios({
                url: 'http://localhost:8080/send',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: {
                    email: currentContact.email, content: newMessage, conversationId: conversationId
                }
            }).then((res) => {
                // let new_arrival = [...feedMessages];
                // new_arrival.push({ self: true, message: res.data.message.content });
                // setFeedMessages(new_arrival);
                socket.current.emit('send_message', { senderId: username, receiverId: currentContact.email, text: newMessage });
                setNewMessage("");
                chatEl.current.scrollIntoView({ behavior: "smooth" });
            }).catch(err => console.log(err));
        }
    }, [update])


    return (
        <div className={Classes.body}>
            <div className={Classes.chatName}>{currentContact.name}</div>
                <div className={Classes.Chat} >
                    {feedMessages.map(message => {
                        if(message.self === true){
                            return <Message key={`${Math.random()}+${message.message}+${new Date().getTime()}+${message.self}`}
                                self={message.self} content={message.message} image={currentProfileImage} />
                        } else {
                            return <Message key={`${Math.random()}+${message.message}+${new Date().getTime()}+${message.self}`}
                                self={message.self} content={message.message} image={currentContact.image} />
                        }
                    })}
                <div className={Classes.dummyDiv} ref={chatEl}>.</div>
                </div>
            <div className={Classes.MessageSection}>
                <input type={"text"} placeholder={"Write a message..."} onChange={e => { setNewMessage(e.target.value) }} value={newMessage} />
                <img src={message_send} alt={"send"} onClick={() => setUpdate(prevState => !prevState)} />
                <span className={Classes.attacher}>
                    <img src={attach} alt={"attach"} onClick={() => {imageUpload.current.click();}}/>
                    <input type={"file"} ref={imageUpload}/>
                </span>
            </div>
        </div>
    );
};

export default Chat;