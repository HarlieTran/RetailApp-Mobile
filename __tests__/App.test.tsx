import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import {Text} from 'react-native';
import App from '../App';

jest.mock('../src/context/AppContext', () => {
  const React = require('react');

  return {
    RetailAppProvider: ({children}: {children: React.ReactNode}) => <>{children}</>,
  };
});

jest.mock('../src/navigation/AppNavigator', () => {
  const React = require('react');

  return {
    AppNavigator: () => <Text>Retail App Navigator</Text>,
  };
});

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
