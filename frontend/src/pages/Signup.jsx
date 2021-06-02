import React, { useState, useContext } from 'react';
import Form from '../components/Form';
import Header from '../components/Header';
import API from '../utils/API';
import { userContext } from '../utils/userContext';

export default function Signup () {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    password: '',
    confirm: '',
  });
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
    } else if (!data.name.trim()) {
      setErrorMsg('Username can\'t be empty');
    } else if (!data.password.trim()) {
      setErrorMsg('Password can\'t be empty');
    } else if (!data.confirm.trim()) {
      setErrorMsg('Please confirm your password');
    } else if (data.password !== data.confirm) {
      setErrorMsg('Passwords don\'t match');
    } else {
      validity = true;
    }
    setShowError(!validity);
    return validity;
  }

  function register () {
    const { confirm, ...rest } = formData;
    api.makeRequest('admin/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(rest),
    })
      .then(data => {
        updateUserSession(data.token);
      })
      .catch(err => {
        setShowError(true);
        setErrorMsg(
          err.message === '400'
            ? 'Email address already registered'
            : err.message
        );
      })
  }

  function submitHandler (e) {
    e.preventDefault();
    validate(formData) && register();
  }

  function changeFormData (data) {
    setFormData({ ...formData, ...data });
  }

  function dismissError () {
    setShowError(false);
  }

  return (
    <>
      <Header title='Sign up'/>
      <Form
        view='signup'
        title='Welcome'
        showMsg={showError}
        message={errorMsg}
        onChange={changeFormData}
        onCloseMsg={dismissError}
        onSubmit={submitHandler}
      />
    </>
  )
}
