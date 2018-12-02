import ReactDOM from "react-dom";
import React from 'react';
import SignUp from './components/SignUp';

const wrapper = document.getElementById('container');
wrapper ? ReactDOM.render(<SignUp />, wrapper) : false;