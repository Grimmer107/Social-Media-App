import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import Classes from './media.module.css';
import Gallery from '../../Components/Gallery/gallery';
import Profile from '../../Components/Profile/profile';

const token = localStorage.getItem('token');
const expiryDate = localStorage.getItem('expiryDate');
const username = localStorage.getItem('email');

const Media = () => {
    let navigate = useNavigate();
    const [showProfile, setShowProfile] = useState(false)
    const [user, setUser] = useState();
    const [profileImg, setProfileImg] = useState();

    useEffect(() => {

        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        axios.get(`http://localhost:8080/details?email=${username}`, {
            headers: {
                Authorization: 'Bearer ' + token
            }
        })
        .then(response => {
            setUser(response.data.userDetails);
            setProfileImg(`http://localhost:8080\\` + response.data.userDetails.profile_picture.replace(/\134/g, "/"));
        }).catch(err => console.log(err));
    }, []);

    return (
        <div className={Classes.body}>
            <div className={Classes.tabs}>
                <div className={`${showProfile ? Classes.files : Classes.files_active }`} onClick={(e) => setShowProfile(false)}>Shared Files</div>
                <div className={`${showProfile ? Classes.profile_active : Classes.profile }`} onClick={(e) => setShowProfile(true)}>User Profile</div>
            </div>
            {showProfile ? <div className={Classes.user_profile}><Profile CurrentUser={user} image={profileImg}/></div> : <div className={Classes.gallery}><Gallery /></div>}
            <div className={Classes.footer}><button>Hi end!</button></div>
        </div>
    );
};

export default Media;