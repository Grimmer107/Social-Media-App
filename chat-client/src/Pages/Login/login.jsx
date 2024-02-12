import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { BeatLoader } from 'react-spinners'
import { io } from 'socket.io-client';

import Classes from './login.module.css';
import chatting_image from '../../Assets/img/chat_background.svg';

import { useNavigate } from 'react-router-dom';

const Login = () => {

    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const [formSubmit, setFormSubmit] = useState(false);

    let navigate = useNavigate();

    const onFormSubmit = (e) => {
        e.preventDefault();
        setFormSubmit(true);
    }

    useEffect(() => {
        if (formSubmit === true) {
            axios({
                method: 'POST',
                url: 'http://localhost:8080',
                data: {
                    email: emailRef.current.value,
                    password: passwordRef.current.value
                }
            })
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('name', response.data.name);
                    localStorage.setItem('email', response.data.email);
                    const remainingMilliseconds = 60 * 60 * 1000;
                    const expiryDate = new Date(
                        new Date().getTime() + remainingMilliseconds
                    );
                    localStorage.setItem('expiryDate', expiryDate.toISOString());
                    const socket = io.connect('ws://localhost:8900');
                    socket.emit('add_user', response.data.email);
                    navigate('/massenger');
                })
                .catch((err) => {
                    console.log(err)
                    setFormSubmit(false)
                });
        }
    }, [formSubmit, navigate]);

    return (
        <div className={Classes.body}>
            <div className={Classes.form__content}>
                <div className={Classes.signin__image}>
                    <img src={chatting_image} alt={"signup"} loading={'lazy'} />
                </div>
                <form onSubmit={(e) => onFormSubmit(e)}>
                    <h1>Chaty</h1>
                    <div className={Classes.input__body}>
                        <input type={"text"} name={"email"} required ref={emailRef} />
                        <span>Email</span>
                    </div>
                    <div className={Classes.input__body}>
                        <input type={"password"} name={"password"} required ref={passwordRef} />
                        <span>Password</span>
                    </div>
                    {!formSubmit ? <input className={Classes.signin__submit__input} type={"submit"} name={"submit"} value={"Login"} /> :
                        (<div className={Classes.signin__loader__div}>
                            <BeatLoader size={10} color={"white"} className={Classes.signin__loader} />
                        </div>)
                    }
                    <div className={Classes.signin__link} onClick={() => navigate('/signup')}>
                        Don't have an account? Sign up
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;