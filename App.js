/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage
} from 'react-native';
import {Scene, Router, Reducer, Actions, ActionConst} from 'react-native-router-flux'
import {Home, Login, SignUp, FindWay, Input, History, ChangePass} from '@layouts'
import { Provider as PaperProvider , DefaultTheme} from 'react-native-paper';
const createReducer = params => {
  const defaultReducer = new Reducer(params);

  return (state, action) => {
    return defaultReducer(state, action);
  }
};

export default class App extends Component {

  render(){
    return(
      <PaperProvider theme={DefaultTheme} >
        <Router createReducer={createReducer}>
          <Scene key='root' direction='horizontal' panHandlers={null} >
            <Scene key='Home' component={Home} hideNavBar   />
            <Scene key='SignUp' component={SignUp} hideNavBar showBackBottom/>
            <Scene key='FindWay' component={FindWay} hideNavBar showBackBottom />
            <Scene key='Login' component={Login} hideNavBar initial  />
            <Scene key='Input' component={Input} hideNavBar showBackBottom />
            <Scene key='History' component={History} hideNavBar showBackBottom/>
            <Scene key='ChangePass' component={ChangePass} hideNavBar showBackBottom/>
          </Scene>
        </Router>
      </PaperProvider>
    )
  }

  
}
