import React from 'react';
import { Navigation } from 'react-native-navigation';

import UsersScreen from '../components/screens/UsersScreen.js';

// register all screens of the app (including internal ones)
export function registerScreens(store = {}, Provider = {}) {
    Navigation.registerComponent('testApp.UsersScreen'    ,  () => UsersScreen    , {}, Provider, store);
}