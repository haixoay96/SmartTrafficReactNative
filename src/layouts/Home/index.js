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
import Base from '../Base'
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { error } from 'util';
const origin = {latitude: 21.1096719, longitude: 105.7260039};
const destination = {latitude: 21.2, longitude: 105.77};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCzNOXHaboNOM_cZHNl-SlUNfeK3KJa1xE';

export default class Home extends Base {
  constructor(props){
    super(props)
    this.state = {
      region: {
        latitude: 21.1096719,
        longitude: 105.7260039,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      },
      listComplete:[],
      modalVisible: false,
      locations: [],
      squares:[]
    }
  }
  search = async (text)=>{
    let URL_SEARCH = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&types=geocode&key=${GOOGLE_MAPS_APIKEY}`
    try {
      let result = await fetch(URL_SEARCH)
      let data = await result.json()
      this.setState({
        ...this.state,
        listComplete:data.predictions
      })
    }catch(e){

    }
  }
  getLocationByID = async (place_id)=>{
    let URL_SEARCH = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${GOOGLE_MAPS_APIKEY}`
    try{
      let result = await fetch(URL_SEARCH)
      let data = await result.json()
      console.log(data)
      let latitude = data.result.geometry.location.lat
      let longitude = data.result.geometry.location.lng
      this.setMain({
        latitude:latitude,
        longitude: longitude
      });
      this.setState({
        ...this.state,
        listComplete:[]
      })
    }catch(e){

    }
  }
  countInBox = (box)=>{
    let locations = this.state.locations;
    let count = 0;
    locations.forEach((value, index)=>{
      if(this.isOnBox(box,value)){
        count++
      }
    });
    return count;
  }
  isOnBox = (box, point)=>{
    //get box
    let top_left = box.top_left;
    let top_right = box.top_right;
    let bottom_right = box.bottom_right;
    let bottom_left = box.bottom_left;
    //get edage
    let top =  top_left.latitude;
    let bottom = bottom_right.latitude;

    let left = top_left.longitude;
    let right = bottom_right.longitude;

    if( point.latitude <= top && point.latitude >= bottom && point.longitude >= left && point.longitude <= right ){
      return true;
    }
    return false;
  }
  componentDidMount(){
    this.divideSquares();
    navigator.geolocation.getCurrentPosition((position) => {
      console.log('get current successfull', position);
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.setMain({
        longitude:longitude,
        latitude:latitude
      });
    }, (error) => {
      console.log(error)
    }, {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 1000
    });
    navigator.geolocation.watchPosition(async(position)=>{
      console.log('Watch:',position)
      alert(JSON.stringify(position))
      this.setMain(position.coords);
      try{
        let result = await fetch('http://192.168.1.91:3000/location', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude
          })
        })
        let data = await result.json()
        console.log(data);
      }catch(e){
        console.error(e);
      }
      

    }, (error)=>{
      console.log('Watch:', error)

    });
    fetch('http://192.168.1.91:3000/location').then((result)=>{
      return result.json();
    }).then((data)=>{
      let locations = data.locations;
      this.setState({
        ...this.state,
        locations:locations
      })
    }).catch((e)=>{
      console.log(e)
    });

  }
  getTop_Left =()=>{
    let position = this.state.region;
    return{
      latitude: position.latitude + 0.05,
      longitude: position.longitude - 0.05
    }
  }
  getTop_Right= ()=>{
    let position = this.state.region;
    return{
      latitude:position.latitude + 0.05,
      longitude:position.longitude + 0.05
    }
  }
  getBottom_Left =()=>{
    let position = this.state.region;
    return{
      latitude:position.latitude - 0.05,
      longitude:position.longitude - 0.05
    }
  }
  getBottom_Right = ()=>{
    let position = this.state.region;
    return{
      latitude:position.latitude - 0.05,
      longitude:position.longitude + 0.05
    }
  }
  setMain = (position)=>{
    this.setState({
      ...this.state,
      region: {
        latitude: position.latitude,
        longitude: position.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }
    });
  }
  divideSquares = ()=>{
    let point = this.getTop_Left();
    let squares = []
    for (i = 0; i< 10; i++){
      for(j = 0; j< 10; j++){
        let top_left = {
          longitude:point.longitude + 0.01*j,
          latitude:point.latitude - 0.01*i
        };
        let top_right = {
          longitude: top_left.longitude + 0.01,
          latitude: top_left.latitude
        };
        let bottom_right = {
          longitude: top_right.longitude,
          latitude: top_right.latitude - 0.01
        };
        let bottom_left = {
          longitude: bottom_right.longitude - 0.01,
          latitude:bottom_right.latitude
        }
        squares.push({
          top_left: top_left,
          top_right:top_right,
          bottom_right:bottom_right,
          bottom_left:bottom_left
        });
      }
    }
    return squares
  }
  onRegionChange=(region)=> {
   // console.log('Change', region.latitudeDelta, region.longitudeDelta)
   // this.setState({ region });
    
  }
  renderItem = (item)=>{
    console.log(item)
    return(
      <TouchableOpacity style={styles.wrapItem} onPress={this.getLocationByID.bind(null, item.item.place_id)} >
        <Text>
          {item.item.description}
        </Text>
      </TouchableOpacity>
    )

  }
  renderContent() {
    let top_left =  this.getTop_Left();
    let top_right = this.getTop_Right();
    let bottom_right =  this.getBottom_Right();
    let bottom_left = this.getBottom_Left();
    let squares = this.divideSquares();
    return (
      <View style={styles.container}>
        <MapView
          showsMyLocationButton={true}
          showsUserLocation={true}
          initialRegion={this.state.region}
          region={this.state.region}
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
            squares.map((value, index)=>{
              let count = this.countInBox(value);
              console.log('count', count)
              return(
                <MapView.Polygon 
                  key={index}
                  coordinates={[
                      value.top_left,
                      value.top_right,
                      value.bottom_right,
                      value.bottom_left
                  ]}

                  fillColor={`rgb(${count}, ${255-count}, 0)`}
                />
              )
            })
          }
          {/* {
            this.state.locations.map((value, index)=>{
              return(
                <MapView.Marker
                  key={index}
                  coordinate={{
                    latitude:value.latitude,
                    longitude: value.longitude
                  }}
                  title={'here'}
                  description={'ok'}
              />
              )
            })
          } */}
        </MapView>
        <View style={styles.wrapSearch}> 
          <TextInput style={{
            padding:10
          }} underlineColorAndroid='transparent' onChangeText={this.search} placeholder='Tìm kiếm ở đây' />
          <FlatList  data={this.state.listComplete} renderItem={this.renderItem}/>
        </View>
        <TouchableOpacity style={styles.findWay} onPress={(e)=>{
          this.setState({
            ...this.state,
            modalVisible:true
          })
        }} > 
          <Text>
            findWay
          </Text>
        </TouchableOpacity>
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={(e)=>{
            this.setState({
              ...this.state,
              modalVisible:false
            })
          }}
        >
          <Text>
            Doing something!
          </Text>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  wrapSearch: {
      position:'absolute',
      top:0,
      left:0,
      right:0,
      backgroundColor:'#ffffff',
      margin:5
  },
  wrapItem:{
    padding:5
  },
  findWay:{
    position:'absolute',
    bottom:0,
    right:0,
    backgroundColor:'#ffffff',
    padding:5,
    margin:5
  },
  map:{
    position:'absolute',
    top:0,
    left:0,
    right:0,
    bottom:0
  }
});
