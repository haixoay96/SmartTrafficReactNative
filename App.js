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
  View
} from 'react-native';
import MapView from 'react-native-maps';


function km2la(km){
  return 110.574*km
}
function jm2long(km){

}
export default class App extends Component<{}> {
  constructor(props){
    super(props)
    this.state = {
      region: {
        latitude: 21.1096719,
        longitude: 105.7260039,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      cols: [],
      rows: []
    }
  }
  componentDidMount(){
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('get current successfull', position)
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.setMain(latitude, longitude);
      this.getCenters(latitude, longitude)
    }, (error) => {
      console.log(error)
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    });

  }
  getCenters = (latitude, longitude)=>{
    console.log(latitude, longitude)
    let top_left = {
      latitude: latitude + 0.05,
      longitude: longitude - 0.05
    }
    let top_right = {
      latitude: latitude + 0.05,
      longitude: longitude + 0.05
    }
    let bottom_left = {
      latitude: latitude - 0.05,
      longitude: longitude - 0.05
    }
    let bottom_right = {
      latitude: latitude - 0.05,
      longitude: longitude + 0.05
    }
    cols = []
    rows = []
    for(i = 0; i < 101;i++){
      let from = {
        latitude: top_left.latitude,
        longitude: top_left.longitude +i*0.001
      };
      let to = {
        latitude: bottom_left.latitude,
        longitude: bottom_left.longitude + i*0.001
      }
      cols.push({
        from:from,
        to:to
      })
    }
    for(i = 0; i < 101;i++){
      let from = {
        latitude: top_left.latitude  - i*0.001,
        longitude: top_left.longitude 
      };
      let to = {
        latitude: top_right.latitude - i*0.001,
        longitude: top_right.longitude 
      }
      cols.push({
        from:from,
        to:to
      })
    }
    setTimeout(()=>{
      this.setState({
      ...this.state,
      cols:cols,
      rows:rows
    });

    },0)
    

  }
  getTop_Left =(latitude, longitude)=>{
    return{
      latitude:latitude + 0.05,
      longitude:longitude - 0.05
    }
  }
  getTop_Right= (latitude, longitude)=>{
    return{
      latitude:latitude + 0.05,
      longitude:longitude + 0.05
    }
  }
  getBottom_Left = (latitude,longitude)=>{
    return{
      latitude:latitude - 0.05,
      longitude:longitude - 0.05
    }
  }
  getBottom_Right = (latitude, longitude)=>{
    return{
      latitude:latitude - 0.05,
      longitude:longitude + 0.05
    }
  }
  setMain = (latitude, longitude)=>{
    this.setState({
      ...this.state,
      region: {
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      }
    })

  }
  onRegionChange=(region)=> {
    console.log('Change', region.latitudeDelta, region.longitudeDelta)
   // this.setState({ region });
    
  }
  render() {
    console.log('render')
    let top_left =  this.getTop_Left(this.state.region.latitude,this.state.region.longitude);
    let top_right = this.getTop_Right(this.state.region.latitude,this.state.region.longitude);
    let bottom_right =  this.getBottom_Right(this.state.region.latitude,this.state.region.longitude);
    let bottom_left = this.getBottom_Left(this.state.region.latitude,this.state.region.longitude);
    console.log(top_right)
    return (
      <View style={styles.container}>
        <MapView
          showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={this.state.region}
          style={styles.map}
          onRegionChange={this.onRegionChange}
        >
          <MapView.Marker
            draggable
            coordinate={{
              latitude:this.state.region.latitude,
              longitude: this.state.region.longitude
            }}
            onDragEnd={(e)=>{
              console.log('Move', e);
              let latitude = e.nativeEvent.coordinate.latitude;
              let longitude = e.nativeEvent.coordinate.longitude;
              this.setMain(latitude,longitude );
              this.getCenters(latitude, longitude);
            }}
            title={'here'}
            description={'ok'}
          />
          <MapView.Polygon 
            coordinates={[
                top_left,
                top_right,
                bottom_right,
                bottom_left
            ]}
            fillColor={'#28bc1e50'}
          />
          {
            [top_left, top_right, bottom_right, bottom_left].map((item, index)=>{
              return(
                <MapView.Marker
                  index={index}
                  draggable
                  coordinate={{
                    latitude:item.latitude,
                    longitude:item.longitude
                  }}
                  title={'here'}
                  description={'ok'}
                />
              )
            })
          }
          {
            this.state.cols.map((item, index)=>{
              return(
                <MapView.Polygon key={index}
                  coordinates={[item.from, item.to]}
                  fillColor={'#28bc1e80'}
                />

              )
            })
          }
          {
            this.state.rows.map((item, index)=>{
              return(
                <MapView.Polygon 
                  key={index}
                  coordinates={[item.from, item.to]}
                  fillColor={'#28bc1e80'}
                />
              )
            })
          }
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  map:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0
  }
});
