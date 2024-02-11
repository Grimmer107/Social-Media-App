import Classes from './message.module.css';

const Message = ({ self, content, type, image }) => {
    return (
        <div className={`${self ? Classes.bodySelf : Classes.bodyFriend}`}>
            <img src={image} alt={"profile"} loading={"lazy"} />
            {type === "image" ? (<div className={Classes.imageMessage}><img src={`http://localhost:8080\\` + content} alt="message"></img></div>) : <p>{content}</p>}
        </div>
    );
};

export default Message;