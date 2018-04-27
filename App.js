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
import {Home, Login, SignUp, FindWay, Input, History} from '@layouts'
const createReducer = params => {
  const defaultReducer = new Reducer(params);

  return (state, action) => {
    return defaultReducer(state, action);
  }
};
export default class App extends Component {
  render(){
    return(
        <Router createReducer={createReducer}>
          <Scene key='root' direction='horizontal' panHandlers={null} >
            <Scene key='Home' component={Home} hideNavBar   />
            <Scene key='SignUp' component={SignUp} hideNavBar showBackBottom/>
            <Scene key='FindWay' component={FindWay} hideNavBar showBackBottom />
            <Scene key='Login' component={Login} hideNavBar initial  />
            <Scene key='Input' component={Input} hideNavBar showBackBottom />
            <Scene key='History' component={History} hideNavBar showBackBottom/>
          </Scene>
        </Router>
    )
  }

  
}
