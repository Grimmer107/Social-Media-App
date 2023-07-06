import React, { useEffect, useState, useContext } from 'react';
import Classes from './contactsSection.module.css';
import Contact from '../../Components/Contact/contact';
import Context from '../../Context/context';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactSection = (props) => {
    const [contacts, setContacts] = useState([]);
    let navigate = useNavigate();
    const {contactFlag} = useContext(Context);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');
        if (!token || !expiryDate) {
            navigate('/');
        }
        if (new Date(expiryDate) <= new Date()) {
            navigate('/');
        }

        axios.get('http://localhost:8080/contacts', {
            headers: {
                Authorization: 'Bearer ' + token
            },
        })
        .then((response) => {
            setContacts(response.data.contacts);
        }).catch(err => console.log(err));

    }, [contactFlag]);

    return (
        <div className={Classes.body}>
            <div className={Classes.heading}>Contacts</div>
            <div className={Classes.scrollbox} tabIndex="0">
                <div className={Classes.contact}>
                    {contacts.map((contact => {
                        return <Contact key={contact.name} name={contact.name} email={contact.email} />
                    }))}
                </div>
            </div>
            <div className={Classes.footer}>
                <button>Logout</button>
            </div>
        </div>
    );
};

export default ContactSection;