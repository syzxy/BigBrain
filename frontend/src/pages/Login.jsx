import React, { useState, useContext } from 'react';
import Form from '../components/Form';
import Header from '../components/Header';
import API from '../utils/API';
import { userContext } from '../utils/userContext';

export default function Login () {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showError, setShowError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { updateUserSession } = useContext(userContext);
  const api = new API();

  function validate (data) {
    let validity = false;
    if (!data.email.trim()) {
      setErrorMsg('Email can\'t be empty');
    } else if (!/^.+@.+\..+$/.test(data.email.trim())) {
      setErrorMsg('Invalid email format');
    } else if (!data.password.trim()) {
      setErrorMsg('Password can\'t be empty');
    } else {
      validity = true;
    }
    setShowError(!validity);
    return validity;
  }

  function logIn () {
    api.makeRequest('admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(data => {
        updateUserSession(data.token);
      })
      .catch(err => {
        setShowError(true);
        setErrorMsg(
          err.message === '400'
            ? 'Email not found or incorrect password'
            : err.message
        );
      })
  }

  function submitHandler (e) {
    e.preventDefault();
    validate(formData) && logIn();
  }

  function changeFormData (data) {
    setFormData({ ...formData, ...data });
  }

  function dismissError () {
    setShowError(false);
  }

  return (
    <>
      <Header title='Log in'/>
      <Form
        view="login"
        title='Welcome Back'
        showMsg={showError}
        message={errorMsg}
        onChange={changeFormData}
        onCloseMsg={dismissError}
        onSubmit={submitHandler}
      />
    </>
  )
}
