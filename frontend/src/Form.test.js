import React from 'react';
import { shallow } from 'enzyme';
// import render from 'react-test-render';
import Form from './components/Form';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

describe('Add Game Button', () => {
  // const noop = () => {};

  const login = shallow(<Form view='login' title='Welcome Back'/>);
  const signup = shallow(<Form view='signup' title='Welcome'/>);

  it('renders the right form', () => {
    expect(login.find(Typography).at(0).text()).toEqual('Welcome Back');
    expect(signup.find(Typography).at(0).text()).toEqual('Welcome');
    expect(login.find(Button).at(0).text()).toEqual('Log In');
    expect(signup.find(Button).at(0).text()).toEqual('Sign Up');
  });
});
