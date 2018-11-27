/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import { avatar, direction, menu } from 'images';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Drawer from 'react-native-drawer';
import MapView from 'react-native-maps';
import { Actions } from 'react-native-router-flux';
import { bottomLeft, bottomRight, HOST, topLeft, topRight } from '../../config';
import Base from '../Base';
import {Drawer as Item} from 'react-native-paper';
const origin = {latitude: 21.1096719, longitude: 105.7260039};
const destination = {latitude: 21.2, longitude: 105.77};
const GOOGLE_MAPS_APIKEY = 'AIzaSyCzNOXHaboNOM_cZHNl-SlUNfeK3KJa1xE';

function ControlPanel(props){
  return(
    <View style={{
      flex:1,
      backgroundColor:'#ffffff'
    }}>
      <Image style={{
        height:100,
        width:100,
        margin:5,
        alignSelf:'center'
      }} source={avatar}/>
      <Text style={{
        alignSelf:'center',
        marginTop:10,
        fontSize:25
      }}>
        {props.username}
      </Text>
      <Item.Section>
        <Item.Item
          label="Tìm đường"
          onPress={(e)=>{
            Actions.FindWay({
              callback: (data)=>{
                props.findPath(data.place_id1, data.place_id2)
              }
            })
          }}
        />
        <Item.Item
          label="Xem lịch sử"
          onPress={(e)=>{
            Actions.History({
              username:props.username
            })
          }}
        />
        <Item.Item
          label="Đổi mật khẩu"
        />
        <Item.Item
          label="Đăng xuất"
          onPress={(e)=>{
            Actions.reset('Login');
          }}
        />
     </Item.Section>
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
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      listComplete:[],
      modalVisible: false,
      locations: [],
      squares:[],
      paths: [],
      currentLocation:{
      }
    }
  }
  getLocationByID =  (place_id)=>{
    let URL_SEARCH = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${place_id}&key=${GOOGLE_MAPS_APIKEY}`
    let result = fetch(URL_SEARCH)
    // let latitude = data.result.geometry.location.lat
    // let longitude = data.result.geometry.location.lng
    return result
  }
  componentDidMount(){
    this.getSquares();
    navigator.geolocation.watchPosition(async(position)=>{
      console.log('Watch:',position)
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;
      this.setState({
        ...this.state,
        currentLocation:{
          latitude:latitude,
          longitude:longitude
        }
      })
      try{
        let result = await fetch(`${HOST}/location`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body:JSON.stringify({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
            username:this.props.username,
            heading:position.coords.heading,
            speed:position.coords.speed
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
  }
  getSquares = async ()=>{
    try{
      let date = new Date();
      
      let result = await fetch(`${HOST}/density`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                year: date.getFullYear(),
                month: date.getMonth(),
                date:date.getDate(),
                hour: date.getHours(),
                minute: date.getMinutes()
            })
      });
      let data = await result.json();
      if( data.status === 1000){
        console.log(data.squares)
        this.setState({
          squares:data.squares
        })
      }
    }catch(e){
      alert(JSON.stringify(e))
    }
  }
  isOnBox(box, point){
    //get box
    let topLeft = box.topLeft;
    let topRight = box.topRight;
    let bottomRight = box.bottomRight;
    let bottomLeft = box.bottomLeft;
    //get edage
    let top =  topLeft.latitude;
    let bottom = bottomRight.latitude;

    let left = topLeft.longitude;
    let right = bottomRight.longitude;
    if( point.latitude <= top && point.latitude >= bottom && point.longitude >= left && point.longitude <= right ){
      return true;
    }
    return false;
  }
  location2point = (from , to)=>{
    location1 = -1;
    location2 = -1;
    this.state.squares.forEach((item, index)=>{
      if(this.isOnBox(item, from)){
        location1 = index;
      }
      if(this.isOnBox(item, to)){
        location2 = index
      }

    })
    return {
      from:location1,
      to:location2
    }

  }
  findPath = async(from , to)=>{
    try{
      let URL_SEARCH_1 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${from}&key=${GOOGLE_MAPS_APIKEY}`
      let URL_SEARCH_2 = `https://maps.googleapis.com/maps/api/place/details/json?placeid=${to}&key=${GOOGLE_MAPS_APIKEY}`
      let result1 = fetch(URL_SEARCH_1)
      let result12 = fetch((URL_SEARCH_2))
      result1 = await result1;
      result12 = await result12;
      let data1 = await result1.json();
      let data2 = await result12.json();
      console.log('location',JSON.stringify(data1.result.geometry.location))
      let point = this.location2point({
        latitude:data1.result.geometry.location.lat,
        longitude:data1.result.geometry.location.lng
      },{
        latitude:data2.result.geometry.location.lat,
        longitude:data2.result.geometry.location.lng
      })
      console.log('point', point)
      if( point.from === -1 && point.to === -1 ){
        alert('Ngoài phạm vi!')
        return
      }
      let result = await fetch(`${HOST}/findpath/${point.from}/${point.to}`);
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
        content={<ControlPanel username={this.props.username} findPath={this.findPath} />}
      >
        <View style={styles.container}>
          <MapView
            showsMyLocationButton={true}
            showsUserLocation={true}
            initialRegion={this.state.region}
            style={styles.map}
            onRegionChange={this.onRegionChange}
          >
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
                    fillColor={`rgba(${255}, ${255-(value.count > 10 ?(200+value.count) :value.count)}, 0, 0.2)`}
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
                justifyContent:'flex-start'
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
              padding:15,
              flex:1
            }} underlineColorAndroid='transparent' onChangeText={this.search} placeholder='Tìm kiếm ở đây' />
            <TouchableOpacity style={{
                alignSelf:'center',
                justifyContent:'flex-end'
            }}
              onPress={(e)=>{
                Actions.FindWay({
                  callback: (data)=>{
                    this.findPath(data.place_id1, data.place_id2)
                  }
                })
              }}
            >
              <Image source={direction} style={{
                height:20,
                width:20,
                marginRight:10
              }}/>
            </TouchableOpacity>
            {/* <FlatList  data={this.state.listComplete} renderItem={this.renderItem}/> */}
          </View>
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
