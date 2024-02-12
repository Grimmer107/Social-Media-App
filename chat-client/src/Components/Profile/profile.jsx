import React from 'react';

import Classes from './profile.module.css';
import ProfileImage from '../ProfileImage/profileImage';

const Profile = ({ CurrentUser, image }) => {

    return (
        <div className={Classes.body}>
            <div className={Classes.profile__photo}>
                <ProfileImage image={image} />
                <p>{CurrentUser.name}</p>
            </div>
            <div className={Classes.separator}><hr /></div>
            <div className={Classes.profile__details}>
                <p><span>Name</span><br />{CurrentUser.name}</p>
                <p><span>Email</span><br />{CurrentUser.email}</p>
                <p><span>Contacts</span><br />{CurrentUser.friends}</p>
            </div>
        </div>
    );
};

export default Profile;