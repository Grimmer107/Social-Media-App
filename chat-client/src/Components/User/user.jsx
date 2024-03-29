import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import defaultUser from '../../Assets/img/user.png'

import Classes from './user.module.css';
import Context from '../../Context/context';

const User = ({ name, email, profilePic }) => {

    const [contactStatus, setContactStatus] = useState("Add to Contacts");
    const { setContactFlag } = useContext(Context);
    const UserRef = useRef(null);

    let navigate = useNavigate();

    useEffect(() => {

        if (contactStatus === 'Added') {

            const token = localStorage.getItem('token');
            const expiryDate = localStorage.getItem('expiryDate');

            if (!token || !expiryDate) {
                navigate('/');
            }
            if (new Date(expiryDate) <= new Date()) {
                navigate('/');
            }

            axios({
                url: 'http://localhost:8080/addContact',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: {
                    name: name, email: email
                },
                method: 'POST'
            })
                .then((response) => {
                }).catch(err => console.log('Error:' + err));
        }

    }, [contactStatus]);

    return (
        <div className={Classes.body} ref={UserRef}>
            <div className={Classes.profile}>
                <div className={Classes.image}><img src={profilePic ? `http://localhost:8080\\${profilePic}` : defaultUser} alt={"profile"} loading={'lazy'} /></div>
                <div className={Classes.details}><p>{name}</p></div>
            </div>
            <div className={Classes.button} onClick={() => {
                setContactStatus("Added");
                setTimeout(() => {
                    UserRef.current.remove();
                    setContactFlag(prevState => !prevState)
                }, 800)
            }}>
                <button>{contactStatus}</button>
            </div>
        </div>
    );
};

export default User;