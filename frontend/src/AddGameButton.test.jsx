import React from 'react';
import { shallow } from 'enzyme';
// import render from 'react-test-render';
import AddGameButton from './components/AddGameButton';
// import Home from './pages/Home';

describe('Add Game Button', () => {
  // const noop = () => {};

  it('triggers onClick event when clicked', () => {
    const onClick = jest.fn();
    shallow(<AddGameButton onClick={onClick}/>).simulate('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
