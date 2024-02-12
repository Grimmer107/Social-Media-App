import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Classes from './contact.module.css'
import Context from '../../Context/context';

const Contact = ({ name, email, sender, lastMessage, type }) => {
    const { setCurrentContact } = useContext(Context);
    const [imageSrc, setImageSrc] = useState();
    const token = localStorage.getItem('token');

    useEffect(() => {
        axios.get(`http://localhost:8080/details?email=${email}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
            .then((response) => {
                setImageSrc((`http://localhost:8080\\` + response.data.userDetails.profile_picture.replace(/\134/g, "/")));
            }).catch(err => console.log(err));
    }, [])

    return (
        <div className={Classes.body} onClick={() => setCurrentContact({ name: name, email: email, image: imageSrc })}>
            <div className={Classes.profile}>
                <img src={imageSrc} alt={"profile"} loading={'lazy'} />
            </div>
            <div className={Classes.details}>
                <p className={Classes.name}>{name}</p>
                <p className={Classes.message}>{type === "image" ? <span><i className="fa-regular fa-image"></i> Photo</span> : lastMessage}</p>
            </div>
        </div>
    );
};

export default Contact;