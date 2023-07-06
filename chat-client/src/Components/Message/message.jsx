import React, { useState } from 'react';
import Classes from './message.module.css';

const Message = (props) => {
    const [image, setImg] = useState(props.image);
    return (
        <div className={`${props.self ? Classes.bodySelf : Classes.bodyFriend}`}>
            <img src={image} alt={"profile"} />
            <p>{props.content}</p>
        </div>
    );
};

export default Message;