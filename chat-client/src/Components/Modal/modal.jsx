import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import Classes from './modal.module.css';
import User from '../User/user';

const Modal = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState(users)

  const onSearchHandle = (e) => {
    const searchQuery = e.target.value;
    let tmpUsers;
    if (searchQuery !== "") {
      tmpUsers = users.filter((user) => {
        return user.name.toLowerCase().includes(searchQuery.toLowerCase())
      })
    } else {
      tmpUsers = users
    }
    setFilteredUsers(tmpUsers)
  }

  useEffect(() => {

    const token = localStorage.getItem('token');
    const expiryDate = localStorage.getItem('expiryDate');
    if (!token || !expiryDate) {
      navigate('/');
    }
    if (new Date(expiryDate) <= new Date()) {
      navigate('/');
    }

    axios.get('http://localhost:8080/users', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    })
      .then((response) => {
        setUsers(response.data.users);
      }).catch(err => console.log(err));

  }, [open]);

  if (open === false) {
    return null
  }
  return ReactDOM.createPortal(
    <>
      <div className={Classes.overlay} onClick={e => setOpen(false)}></div>
      <div className={Classes.body} onClick={e => e.stopPropagation()}>
        <div className={Classes.content}>

          <div className={Classes.Search__section}>
            <div className={Classes.search}>
              <input type={"text"} placeholder={"Search for people"} spellCheck={"false"} onChange={(e) => onSearchHandle(e)} />
              <i className={"fa-solid fa-magnifying-glass"}></i>
            </div>
            {/* <div className={Classes.search__button}><button>Search</button></div> */}
            <div className={Classes.close__button} onClick={e => setOpen(false)}><i className={"fa-solid fa-xmark"}></i></div>
          </div>
          <div className={Classes.scrollbox}>
            <div className={Classes.add__friend}>
              {filteredUsers.map(user => {
                return <User key={user.name} name={user.name} email={user.email} profilePic={user.profile_picture} />
              })}
            </div>
          </div>
        </div>
      </div>
    </>,
    document.querySelector('#modal')
  );
};


export default Modal;