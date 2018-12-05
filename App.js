/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AsyncStorage,
  PermissionsAndroid
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
  requestCameraPermission = async ()=>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Request location',
          'message': 'You can use location'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the Location")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  render(){
    this.requestCameraPermission()
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
