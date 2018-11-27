import React,{Component} from 'react';
import {View, Text,TextInput,TouchableOpacity ,StyleSheet, FlatList} from 'react-native';
import Base from '../Base';
import {Actions} from 'react-native-router-flux';
import {List} from 'react-native-paper';
const GOOGLE_MAPS_APIKEY = 'AIzaSyCzNOXHaboNOM_cZHNl-SlUNfeK3KJa1xE';
export default class Input extends Base{
    constructor(props){
        super(props);
        this.text = '';
        this.state = {
            listComplete:[]
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
    keyExtractor = (item, index) => item.place_id;
    renderItem = (data)=>{
        return(
            <List.Item 
                title={data.item.description}
                onPress={(e)=>{
                    Actions.pop();
                    this.props.callback({
                        value:data.item.description,
                        place_id:data.item.place_id
                    })
                }}
            />
        )
    }
    renderContent(){
        return(
            <View style={{
                flex:1
            }}>
                <TextInput
                    style={{
                        marginTop:5,
                        marginLeft:50,
                        height:40,

                    }}
                    autoFocus={true}
                    onChangeText={(text)=>{
                        this.search(text)
                    }}
                    placeholder={this.props.title}
                    placeholderTextColor='#000000'
                />
                <View style={{
                    flex:1
                }}>
                    <FlatList  data={this.state.listComplete} keyExtractor={this.keyExtractor} renderItem={this.renderItem}/>
                </View>
            </View>
        )
    }
}