/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';
import {Scene, Router, Reducer, Actions, ActionConst} from 'react-native-router-flux'
import {Home} from '@layouts'
const createReducer = params => {
  const defaultReducer = new Reducer(params);

  return (state, action) => {
    return defaultReducer(state, action);
  }
};
export default class App extends Component<{}> {
  render(){
    return(
        <Router createReducer={createReducer}>
          <Scene key='root' direction='horizontal'>
            <Scene key='Home' component={Home} hideNavBar initial/>
          </Scene>
        </Router>
    )
  }

  
}
