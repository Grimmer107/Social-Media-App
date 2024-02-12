import React from 'react';
import Classes from './profileImage.module.css';
import defaultUser from '../../Assets/img/user.png'

const ProfileImage = ({ image }) => {

    return (
        <div className={Classes.profile__photo}>
            <img src={image ? image : defaultUser} alt={"profile"} loading={'lazy'} />
        </div>
    );
};

export default ProfileImage;