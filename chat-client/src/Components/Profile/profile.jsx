import { ClipLoader } from "react-spinners";

import Classes from './profile.module.css';
import ProfileImage from '../ProfileImage/profileImage';

const Profile = ({ currentUser, image }) => {

    return (
        <div className={Classes.body}>
            {image ? <>
                <div className={Classes.profile__photo}>
                    <ProfileImage image={image} />
                    <p>{currentUser.name}</p>
                </div>
                <div className={Classes.separator}><hr /></div>
                <div className={Classes.profile__details}>
                    <p><span>Name</span><br />{currentUser.name}</p>
                    <p><span>Email</span><br />{currentUser.email}</p>
                    <p><span>Friends</span><br />{currentUser.contacts.length}</p>
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