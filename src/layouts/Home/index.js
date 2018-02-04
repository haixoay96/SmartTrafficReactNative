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
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      },
      cols: [],
      rows: [],
      listComplete:[],
      modalVisible: false
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
    console.log('get', place_id)
    
    let URL_SEARCH = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${GOOGLE_MAPS_APIKEY}`
    try{
      let result = await fetch(URL_SEARCH)
      let data = await result.json()
      console.log(data)
      let latitude = data.result.geometry.location.lat
      let longitude = data.result.geometry.location.lng
      this.setMain(latitude, longitude);
      this.getCenters(latitude, longitude)
      this.setState({
        ...this.state,
        listComplete:[]
      })
      
      console.log('change')

    }catch(e){

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
    navigator.geolocation.watchPosition(async(position)=>{
      console.log('Watch:',position)
      try{
        let result = fetch('http://localhost:3000/location', {
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
        console.log(result);
      }catch(e){
        console.error(e);
      }
      

    }, (error)=>{
      console.log('Watch:', error)

    })

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
                  key={index}
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
          <MapViewDirections
            origin={origin}
            destination={destination}
            apikey={GOOGLE_MAPS_APIKEY}
          />
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
