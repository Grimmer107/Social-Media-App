import React, { useEffect, useState } from 'react';
import Classes from './gallery.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import Pic1 from '../../Assets/img/cloud_on_mountain.jpg';

const expiryDate = localStorage.getItem('expiryDate');
const username = localStorage.getItem('email');
const token = localStorage.getItem('token');

const Gallery = () => {

    const navigate = useNavigate();
    const [media, setMedia] = useState([]);

    useEffect(() => {

        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        axios.get(`http://localhost:8080/media`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(response => {
            setMedia(response.data.media)
        }).catch((error) => {
            console.log(error)
        })

    }, [])
    return (
        <div className={Classes.scrollbox}>
            <div className={Classes.body}>
                {media && media.map((image) => {
                    return <img key={image} src={`http://localhost:8080\\${image}`} alt={"media"} loading={'lazy'} />
                })}

            </div>
        </div>
    );
};

export default Gallery;