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
  Modal,
  Image
} from 'react-native';
import Base from '../Base'
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Drawer from 'react-native-drawer'
import { Actions} from 'react-native-router-flux';
import { error } from 'util';
import {menu} from 'images';
import { deltaLongitude, deltaLatitude, topLeft, topRight, bottomLeft, bottomRight, HOST} from '../../config';

const origin = {latitude: 21.1096719, longitude: 105.7260039};
const destination = {latitude: 21.2, longitude: 105.77};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCzNOXHaboNOM_cZHNl-SlUNfeK3KJa1xE';

function ControlPanel(props){
  return(
    <View style={{
      flex:1,
      backgroundColor:'#ffffff'
    }}>
      <Text style={{
        alignSelf:'center',
        marginTop:10,
        fontSize:20
      }}>
        {props.username}
      </Text>
      <Text style={{
        alignSelf:'center',
        position:'absolute',
        bottom:0,
        padding:20,
        backgroundColor:'green',
        marginBottom:20
      }}
        onPress={(e)=>{
          Actions.reset('Login');
        }}
      >
        Logout
      </Text>

    </View>
  )
}

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
      squares:[],
      paths: []
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
    this.getSquares();
    // navigator.geolocation.getCurrentPosition((position) => {
    //   console.log('get current successfull', position);
    //   let latitude = position.coords.latitude;
    //   let longitude = position.coords.longitude;
    //   this.setMain({
    //     longitude:longitude,
    //     latitude:latitude
    //   });
    // }, (error) => {
    //   console.log(error)
    // }, {
    //   enableHighAccuracy: true,
    //   timeout: 20000,
    //   maximumAge: 1000
    // });
    // navigator.geolocation.watchPosition(async(position)=>{
    //   console.log('Watch:',position)
    //   alert(JSON.stringify(position))
    //   this.setMain(position.coords);
    //   try{
    //     let result = await fetch('http://192.168.1.91:3000/location', {
    //       method: 'POST',
    //       headers: {
    //         Accept: 'application/json',
    //         'Content-Type': 'application/json',
    //       },
    //       body:JSON.stringify({
    //         longitude: position.coords.longitude,
    //         latitude: position.coords.latitude
    //       })
    //     })
    //     let data = await result.json()
    //     console.log(data);
    //   }catch(e){
    //     console.error(e);
    //   }
      

    // }, (error)=>{
    //   console.log('Watch:', error)

    // });
    // fetch('http://192.168.1.91:3000/location').then((result)=>{
    //   return result.json();
    // }).then((data)=>{
    //   let locations = data.locations;
    //   this.setState({
    //     ...this.state,
    //     locations:locations
    //   })
    // }).catch((e)=>{
    //   console.log(e)
    // });

  }
  getSquares = async ()=>{
    try{
      let result = await fetch(`${HOST}/location`);
      let data = await result.json();
      if( data.status === 1000){
        this.setState({
          squares:data.squares
        })
      }
    }catch(e){
      alert(JSON.stringify(e))
    }
  }
  findPath = async( from , to)=>{
    try{
      let result = await fetch(`${HOST}/findpath/${from}/${to}`);
      let data = await result.json();
      if( data.status === 1000){
        this.setState({
          ...this.state,
          paths: data.paths
        })
        alert(data.paths)
      }

    }catch(e){
      alert(JSON.stringify(e));
    }
  }
  divideSquares = ()=>{
    let point = topLeft;
    let squares = [];
    let unitLatitude = deltaLatitude/23.0;
    let unitLongitude = deltaLongitude/56.0;
    for ( let i = 0 ; i< 23; i++){
        for ( let j = 0 ; j < 56 ;j++){
            let topLeft = {
                longitude:point.longitude + unitLongitude*j,
                latitude:point.latitude - unitLatitude*i
            };
            let topRight = {
                longitude: topLeft.longitude + unitLongitude,
                latitude: topLeft.latitude
            };
            let bottomRight = {
                longitude: topRight.longitude,
                latitude: topRight.latitude - unitLatitude
            };
            let bottomLeft = {
                longitude: bottomRight.longitude - unitLongitude,
                latitude: bottomRight.latitude
            }
            squares.push({
                topLeft: topLeft,
                topRight:topRight,
                bottomRight:bottomRight,
                bottomLeft:bottomLeft
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
    return (
      <Drawer
        openDrawerOffset={0.2}
        tapToClose={true}
        type='static'
        ref={(ref) => this._drawer = ref}
        content={<ControlPanel username={this.props.username}/>}
      >
        <View style={styles.container}>
          <MapView
            showsMyLocationButton={true}
            showsUserLocation={true}
            initialRegion={this.state.region}
            region={this.state.region}
            style={styles.map}
            onRegionChange={this.onRegionChange}
          >
            {/* <MapView.Marker
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
            /> */}
            <MapView.Polygon 
              coordinates={[
                  topLeft,
                  topRight,
                  bottomRight,
                  bottomLeft
              ]}
             // fillColor={'rgba(20,23,45,50)'}
            />
            {
              this.state.squares.map((value, index)=>{
                return(
                  <MapView.Polygon 
                    key={index}
                    coordinates={[
                        value.topLeft,
                        value.topRight,
                        value.bottomRight,
                        value.bottomLeft
                    ]}

                    fillColor={`rgba(${value.count*8}, ${255-value.count}, 0, 0.2)`}
                  />
                )
              })
            }
            {
              this.state.paths.map((value, index)=>{
                return(
                  <MapView.Marker
                    key={index}
                    coordinate={{
                      latitude:(this.state.squares[value].topLeft.latitude + this.state.squares[value].bottomLeft.latitude)/2.0,
                      longitude: (this.state.squares[value].topLeft.longitude + this.state.squares[value].topRight.longitude)/2.0,
                    }}
                    title={'here'}
                    description={'ok'}
                />
                )
              })
            }
          </MapView>
          <View style={styles.wrapSearch}>
            <TouchableOpacity style={{
                alignSelf:'center',
            }}
              onPress={(e)=>{
                this._drawer.open()
              }}
            >
              <Image source={menu} style={{
                height:20,
                width:20,
                marginLeft:10
              }}/>
            </TouchableOpacity>
            <TextInput style={{
              padding:10
            }} underlineColorAndroid='transparent' onChangeText={this.search} placeholder='Tìm kiếm ở đây' />
            {/* <FlatList  data={this.state.listComplete} renderItem={this.renderItem}/> */}
          </View>
          <TouchableOpacity style={styles.findWay} onPress={(e)=>{
            alert('Search!')
            this.findPath(300,1100)
          }} > 
            <Text>
              findWay
            </Text>
          </TouchableOpacity>
          {/* <Modal
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
          </Modal> */}
        </View>
      </Drawer>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  wrapSearch: {
      flexDirection: 'row',
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
