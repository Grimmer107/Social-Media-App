import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Classes from './contact.module.css'
import Context from '../../Context/context';

const Contact = ({name, email}) => {
    const {setCurrentContact} = useContext(Context);
    const [imageSrc, setImageSrc] = useState();
    const [update, setUpdate] = useState(false);

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
        <div className={Classes.body} onClick={() => setCurrentContact({name: name, email: email, image: imageSrc})}>
            <div className={Classes.profile}>
                <img src={imageSrc} alt={"profile"} />
            </div>
            <div className={Classes.details}>
                <p className={Classes.name}>{name}</p>
                <p className={Classes.message}>Where are you going?</p>
            </div>
        </div>
    );
};

export default Contact;