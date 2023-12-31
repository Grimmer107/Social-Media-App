import React from 'react';
import Classes from './profileImage.module.css';

const ProfileImage = ({image}) => {

    return (
        <div className={Classes.profile__photo}>
            <img src={image} alt={"profile"} />
        </div>
    );
};

export default ProfileImage;