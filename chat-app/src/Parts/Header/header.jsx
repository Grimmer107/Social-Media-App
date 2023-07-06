import React, { useEffect, useState } from 'react';
import Classes from './header.module.css';
import Modal from '../../Components/Modal/modal';
import axios from 'axios';

const token = localStorage.getItem('token');
const username = localStorage.getItem('email');

const Header = () => {
    const [showModal, setShowModal] = useState(false);
    const [image, setImage] = useState();

    useEffect(() => {
        axios.get(`http://localhost:8080/details?email=${username}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => {
            setImage(`http://localhost:8080\\` + response.data.userDetails.profile_picture.replace(/\134/g, "/"));
        }).catch(err => console.log(err));
    }, [])

    return (
        <>
            <Modal open={showModal} setOpen={setShowModal} />
            <div className={Classes.body}>
                <div className={Classes.title}>
                    <p><i className="fa-solid fa-comment-dots" style={{ color: '#6545df' }}></i>Chaty</p>
                </div>
                <div className={Classes.notifications}>
                    <div className={Classes.search} onClick={e => setShowModal(true)}>
                        <input type={"text"} placeholder={"Search for people"} spellCheck={"false"} />
                        <i className="fa-solid fa-magnifying-glass"></i>
                    </div>
                    <i id={"bell"} className="fa-solid fa-bell"></i>
                    <div className={Classes.notificationCount}>
                        3
                    </div>
                    <img src={image} alt={"profile"} />
                </div>
            </div>
        </>
    );
};

export default Header;