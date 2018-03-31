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
import {Actions} from 'react-native-router-flux';
import {arrowLeft} from 'images';

export default class Base extends Component{
    goBack = ()=>{
        Actions.pop();
    }
    render(){
        return(
            <View style={styles.container}>
                {this.renderContent()}
                {
                    this.props.showBackBottom?(
                    <TouchableOpacity style={styles.arrowLeft}
                        onPress={(e)=>{
                            this.goBack()
                        }}
                    >
                        <Image source={arrowLeft} style={styles.icon} />
                    </TouchableOpacity>
                    ):null
                }
            </View>
        )
    }
    renderContent(){
        return(
            <View>
                <Text>
                    There's no renderContent
                </Text>
            </View>
           
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.select({
            ios:20,
            android:0
        }),
        flex:1
    },
    arrowLeft:{
        position: 'absolute', 
        top:10,
        left:10,
    },
    icon:{
        height:30,
        width:30,
        resizeMode:'contain'
    }
});