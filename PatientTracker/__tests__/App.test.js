import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    renderer.create(<App />);
  });
});
