import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BeatLoader } from 'react-spinners'

import Classes from './signup.module.css';
import chatting_image from '../../Assets/img/chat_background.svg';

const Signup = () => {

    const nameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const fileRef = useRef(null);

    const [formSubmit, setFormSubmit] = useState(false);
    const [userImage, setUserImage] = useState(null);
    const [imageUploaded, setImageUploaded] = useState(false)

    let navigate = useNavigate();

    const onFormSubmit = (e) => {
        e.preventDefault();
        setFormSubmit(true);
        if (e.target.file.files.length > 0) {
            setUserImage(e.target.file.files[0]);
        } else {
            setUserImage("public\\images\\user.png");
        }
    }

    useEffect(() => {
        if (formSubmit === true) {
            const formData = new FormData();
            formData.append('name', nameRef.current.value);
            formData.append('email', emailRef.current.value);
            formData.append('password', passwordRef.current.value);
            formData.append('profilePic', userImage);

            axios.post('http://localhost:8080/signup',
                formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            })
                .then(response => {
                    navigate('/');
                })
                .catch(err => console.log(err));
        }
    }, [formSubmit, navigate, userImage]);

    return (
        <div className={Classes.body}>
            <div className={Classes.form__content}>
                <div className={Classes.signup__image}>
                    <img src={chatting_image} alt={"signup"} loading={'lazy'} />
                </div>
                <form onSubmit={(e) => onFormSubmit(e)} encType="multipart/form-data">
                    <h1>Sign up</h1>
                    <div className={Classes.input__body}>
                        <input type={"text"} name={"name"} required ref={nameRef} />
                        <span>Name</span>
                    </div>
                    <div className={Classes.input__body}>
                        <input type={"text"} name={"email"} required ref={emailRef} />
                        <span>Email</span>
                    </div>
                    <div className={Classes.input__body}>
                        <input type={"password"} name={"password"} required ref={passwordRef} />
                        <span>Password</span>
                    </div>
                    <label htmlFor={"file"} className={Classes.file__input}>
                        <input id={"file"} type={"file"} name={"file"} ref={fileRef} onChange={(e) => setImageUploaded((prevState) => {
                            return (fileRef.current && fileRef.current.value) ? true : false
                        })} />
                        < span > {imageUploaded ? "Uploaded" : "Upload Picture"}</span>
                    </label>
                    {!formSubmit ?
                        <input className={Classes.singup__submit__input} type={"submit"} name={"submit"} value={"Sign up"} /> :
                        (<div className={Classes.signup__loader__div}>
                            <BeatLoader size={10} color={"white"} className={Classes.signup__loader} />
                        </div>)
                    }
                    <div className={Classes.login__link} onClick={() => navigate('/')}>
                        Return to login
                    </div>
                </form>
            </div>
        </div >
    );
};

export default Signup;

