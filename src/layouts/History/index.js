import React, {Component} from 'react';
import {View, Text} from 'react-native';
import Base from '../Base';
import MapView from 'react-native-maps';
import { deltaLongitude, deltaLatitude, topLeft, topRight, bottomLeft, bottomRight, HOST} from '../../config';

export default class History extends Base{
    constructor(props){
        super(props);
        this.state = {
            region: {
              latitude: 21.1096719,
              longitude: 105.7260039,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            historys:[]
        }
    }
    componentDidMount(){
        fetch(`${HOST}/history`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body:JSON.stringify({
              username:this.props.username
            })
        }).then((result)=>{
            return result.json()
        }).then((data)=>{
            if(data.status === 1000){
                this.setState({
                    ...this.state,
                    historys:data.historys
                })
            }
        }).catch((e)=>{
            console.error(e);
        })
    }
    renderContent(){
        return(
            <View style={{
                flex:1,
                backgroundColor: '#F5FCFF',
            }}>
                <MapView
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    initialRegion={this.state.region}
                    style={{
                        position:'absolute',
                        top:0,
                        left:0,
                        right:0,
                        bottom:0
                    }}
                 >
                {
                    this.state.historys.map((item, index)=>{
                        return(
                            <MapView.Marker
                                key={index}
                                coordinate={{
                                latitude:item.latitude,
                                longitude: item.longitude
                                }}
                                title={'here'}
                                description={'ok'}
                            />
                        )
                    })
                }
                </MapView>
            </View>
        )
    }

}