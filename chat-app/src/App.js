import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Classes from './App.module.css';
import Main from './Pages/Main/main';
import Signup from './Pages/Signup/signup';
import Login from './Pages/Login/login';


function App() {
  
  return (
    <div className={Classes.App}>
      <Routes>
        <Route path='/' exact element={<Login />} />
        <Route path='/signup' exact element={<Signup />} />
        <Route path='/massenger' exact element={<Main />} />
      </Routes>
    </div>
  );
}

export default App;
