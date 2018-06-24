import { Navigation } from 'react-native-navigation';
import { Provider }   from 'mobx-react';

import { registerScreens } from './src/navigation/screens.js';

import stores from './src/stores';

registerScreens(stores, Provider);

Navigation.startSingleScreenApp({
  screen: {
    screen : 'testApp.UsersScreen',
    title  : 'GitHub Users'
  }
});