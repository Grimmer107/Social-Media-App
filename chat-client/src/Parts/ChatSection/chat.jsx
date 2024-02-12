import React, { useState, useRef, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { BarLoader } from "react-spinners";
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
    const attachmentUpload = useRef(null);

    const { currentContact } = useContext(Context);

    const [feedMessages, setFeedMessages] = useState();
    const [newMessage, setNewMessage] = useState("");
    const [receivedMessage, setReceivedMessage] = useState("");

    const [update, setUpdate] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [currentProfileImage, setCurrentProfileImage] = useState();
    const [contactChanged, setContactChanged] = useState(false);

    const [formSubmit, setFormSubmit] = useState(false);
    const [attachmentFile, setAttachmentFile] = useState(null);

    let navigate = useNavigate();

    const chatEl = useRef(null);

    useEffect(() => {
        setContactChanged(true)
    }, [currentContact])

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
                                return { self: true, message: mess.content, image: profiler, type: mess.type }
                            } else if (mess.sender === currentContact.email) {
                                return { self: false, message: mess.content, image: currentContact.image, type: mess.type }
                            }
                        })
                        setFeedMessages(feed);
                        setContactChanged(false);
                        setCurrentProfileImage(profiler);
                    }).catch(err => console.log(err));
            }
        }).catch(err => console.log(err));

    }, [currentContact])


    useEffect(() => {
        socket.current = io.connect('ws://localhost:8900');
        socket.current.on('receive_message', data => {
            if (data.text) {
                if (data.senderId === username) {
                    setReceivedMessage({ self: true, message: data.text, type: data.type });
                }
                else if (data.receiverId === username) {
                    setReceivedMessage({ self: false, message: data.text, type: data.type });
                }
            }
        });
    }, [])


    useEffect(() => {
        let newArrivals;
        if (feedMessages) {
            newArrivals = [...feedMessages, receivedMessage];
        } else {
            newArrivals = [receivedMessage]
        }
        setFeedMessages(newArrivals);
        chatEl.current.scrollIntoView({ behavior: "smooth" });
    }, [receivedMessage])


    useEffect(() => {
        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        if (newMessage !== "" && currentContact.email) {
            axios({
                url: 'http://localhost:8080/send',
                method: 'POST',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: {
                    email: currentContact.email, content: newMessage, conversationId: conversationId, type: "text"
                }
            }).then((res) => {
                socket.current.emit('send_message', { senderId: username, receiverId: currentContact.email, text: newMessage, type: "text" });
                // let new_arrival = [...feedMessages, { self: true, message: newMessage, type: "text" }];
                // setFeedMessages(new_arrival);
                setNewMessage("");
                chatEl.current.scrollIntoView({ behavior: "smooth" });
            }).catch(err => console.log(err));
        }
        if (formSubmit === true) {
            const formData = new FormData();
            formData.append('attachmentFile', attachmentFile);

            axios.post('http://localhost:8080/attachment',
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": 'Bearer ' + token
                }
            })
                .then(response => {
                    if (attachmentFile) {
                        axios({
                            url: 'http://localhost:8080/send',
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + token,
                                "Content-Type": "multipart/form-data"
                            },
                            data: {
                                email: currentContact.email, content: response.data.file_path, conversationId: conversationId, type: "image"
                            }
                        }).then((res) => {
                            socket.current.emit('send_message', { senderId: username, receiverId: currentContact.email, text: attachmentFile.name, type: "image" });
                            // let new_arrival = [...feedMessages, { self: true, message: attachmentFile.name, type: "image" }];
                            // setFeedMessages(new_arrival);
                            attachmentUpload.current.value = null
                            chatEl.current.scrollIntoView({ behavior: "smooth" });
                            setFormSubmit(false);
                        }).catch(err => console.log(err));
                    }
                })
                .catch(err => console.log(err));
        }
    }, [update, formSubmit, attachmentFile])



    const onFormSubmit = (e) => {
        e.preventDefault();
        setFormSubmit(true);
        setAttachmentFile(e.target.files[0]);
    }


    return (
        <div className={Classes.body}>
            <div className={Classes.chatName}>{currentContact.name}</div>
            <div className={Classes.Chat} >
                {currentContact.name ?
                    <>
                        {(feedMessages && (contactChanged === false)) ? feedMessages.map(message => {
                            if (message.self === true) {
                                return <Message key={`${Math.random()}+${message.message}+${new Date().getTime()}+${message.self}`}
                                    self={message.self} content={message.message} image={currentProfileImage} type={message.type} />
                            } else {
                                return <Message key={`${Math.random()}+${message.message}+${new Date().getTime()}+${message.self}`}
                                    self={message.self} content={message.message} image={currentContact.image} type={message.type} />
                            }
                        }) : <div className={Classes.media__loader}>
                            <BarLoader size={150} color={"#543795"} />
                        </div>}

                    </> : <div className={Classes.media__loader}><p className={Classes.choose__contact}><i className="fa-brands fa-rocketchat"></i>&nbsp; Connect with friends !</p></div>
                }
                <div className={Classes.dummyDiv} ref={chatEl}>.</div>
            </div>
            <div className={Classes.MessageSection}>
                <input type={"text"} placeholder={"Write a message..."} onChange={e => { setNewMessage(e.target.value) }} value={newMessage} />
                <img src={message_send} alt={"send"} onClick={() => setUpdate(prevState => !prevState)} />
                <span className={Classes.attacher}>
                    <input id={"attachment"} type={"file"} ref={attachmentUpload} name={"attachment"} onChange={(e) => onFormSubmit(e)} />
                    <img src={attach} alt={"attach"} onClick={() => { attachmentUpload.current.click(); }} />
                </span>
            </div>
        </div>
    );
};

export default Chat;