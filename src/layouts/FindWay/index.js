import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Actions } from 'react-native-router-flux';
import Base from '../Base';

export default class FindWay extends Base{
    constructor(props){
        super(props);
        this.text1='Chọn điểm xuất phát...';
        this.text2='Chọn điểm đến...';
        this.place_id1 = '';
        this.place_id2 = '';
    }
    renderContent(){
        console.log('test',this.props.title, this.props.value, this.props.place_id)
        if(this.props.title && this.props.value!==''){
            this.text1 = this.props.title === 'Chọn điểm xuất phát...'?this.props.value:this.text1;
            this.text2 = this.props.title === 'Chọn điểm đến...'?this.props.value:this.text2;
            this.place_id1 = this.props.title === 'Chọn điểm xuất phát...'?this.props.place_id:this.place_id1;
            this.place_id2 = this.props.title === 'Chọn điểm đến...'?this.props.place_id:this.place_id2;
        }

        if(this.place_id1 !=='' && this.place_id2 !==''){
            Actions.pop();
            Actions.refresh({
                place_id1:this.place_id1,
                place_id2:this.place_id2
            })
        }
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
                                title:'Chọn điểm xuất phát...'
                            })
                        }}
                        
                        >
                            <Text>
                                {
                                    this.text1
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
                                title:'Chọn điểm đến...'
                            })
                        }}
                        >
                            <Text>
                                {
                                    this.text2
                                }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    {/* <TouchableOpacity style={{
                    }}>
                        <Image 
                            style={{
                                height:30,
                                width:30
                            }}
                        source={swap}/>
                    </TouchableOpacity> */}
                </View>
                <View style={{
                    flex:1
                }}>

                </View>
            </View>
        )
    }
}