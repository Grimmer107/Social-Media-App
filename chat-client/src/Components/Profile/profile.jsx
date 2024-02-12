import React from 'react';
import { ClipLoader } from "react-spinners";

import Classes from './profile.module.css';
import ProfileImage from '../ProfileImage/profileImage';

const Profile = ({ CurrentUser, image }) => {

    return (
        <div className={Classes.body}>
            {image ? <>
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
            </> :
                <div className={Classes.media__loader}>
                    <ClipLoader size={100} color={"#543795"} />
                </div>
            }
        </div>
    );
};

export default Profile;