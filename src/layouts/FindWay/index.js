import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Base from '../Base';

export default class FindWay extends Base{
    constructor(props){
        super(props);
        this.state = {
            text1: 'Chọn điểm xuất phát...',
            text2: 'Chọn điểm đến...',
            place_id1: '',
            place_id2: ''
        }
       
    }
    componentDidUpdate(){
        if(this.state.place_id1 !=='' && this.state.place_id2 !==''){
            Actions.pop();
            this.props.callback({
                place_id1:this.state.place_id1,
                place_id2:this.state.place_id2
            })
        }
    }
    renderContent(){
        return(
            <View>
                <View style={{
                    backgroundColor:'#007bff',
                    height:130
                }}>
                    <View style={{
                        marginLeft:50,
                        marginTop:10,
                        marginRight:40
                    }}>
                        <TouchableOpacity style={{
                            backgroundColor:'#5792f2',
                            padding:10,
                            margin:5
                        }}
                        onPress={(e)=>{
                            Actions.Input({
                                callback:(data)=>{
                                    this.setState({
                                        ...this.state,
                                        text1: data.value,
                                        place_id1: data.place_id
                                    })
                                }
                            })
                        }}
                        >
                            <Text>
                                {
                                    this.state.text1
                                }
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            backgroundColor:'#5792f2',
                            padding:10,
                            margin:5
                        }}
                        onPress={(e)=>{
                            Actions.Input({
                                callback:(data)=>{
                                    this.setState({
                                        ...this.state,
                                        text2: data.value,
                                        place_id2: data.place_id
                                    })
                                }
                            })
                        }}
                        >
                            <Text>
                                {
                                    this.state.text2
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{
                    flex:1
                }}>
                </View>
            </View>
        )
    }
}