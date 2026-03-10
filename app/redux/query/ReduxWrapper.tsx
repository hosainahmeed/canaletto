
import React from 'react';
import { Provider } from 'react-redux';
import store from './store';

const ReduxWrapper = ({ children }: { children: React.ReactNode }) => {
  try {
    return <Provider store={store}>{children}</Provider>;
  } catch (error) {
    console.error('ReduxWrapper error:', error);
    return <>{children}</>;
  }
};

export default ReduxWrapper;
