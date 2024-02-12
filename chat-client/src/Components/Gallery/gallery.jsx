import React, { useEffect, useState } from 'react';
import Classes from './gallery.module.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ClipLoader } from "react-spinners";

const expiryDate = localStorage.getItem('expiryDate');
const token = localStorage.getItem('token');

const Gallery = () => {

    const navigate = useNavigate();
    const [media, setMedia] = useState();

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
        <>
            {media ? <div className={Classes.scrollbox}>
                <div className={Classes.body}>
                    {media.length > 0 ?
                        <>
                            {media.map((image) => {
                                return <img key={image} src={`http://localhost:8080\\${image}`} alt={"media"} loading={'lazy'} />
                            })}
                        </>
                        : <div className={Classes.no__gallery}>No Images !</div>
                    }

                </div>
            </div> : <div className={Classes.media__loader}>
                <ClipLoader size={100} color={"#543795"} />
            </div>}
        </>
    );
};

export default Gallery;