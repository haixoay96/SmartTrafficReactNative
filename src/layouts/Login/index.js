import React, {Component} from 'react';
import {View, Text,TextInput , TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Base from '../Base';
import {HOST} from '../../config';
import { action } from 'mobx';

export default class Login extends Base{
    constructor(props){
        super(props);
        this.username = this.props.username?this.props.username:'';
        this.password = this.props.password?this.props.password:'';
    }
    goToSignUp = ()=>{
        Actions.SignUp();
    }
    makeLogin = async ()=>{
        let username = this.username;
        let password = this.password;
        if (username === '' || password=== ''){
            alert('Hoàn thiện username và password!');
            return;
        }
        try{
            let result = await fetch(`${HOST}/login`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username:username,
                    password:password
                })
            });
            let data = await result.json();
            if(data.status === 1000){
                AsyncStorage.setItem('username',username)
                Actions.Home({
                    username:username
                });
                return;
            }
            alert(JSON.stringify(data));
        }catch(e){
            alert(JSON.stringify(e));
            console.error(e)
        }
    }
    renderContent(){
        return(
            <View style={styles.container}>
                <Text style={{
                    alignSelf:'center',
                    marginTop:'20%',
                    fontSize:25
                }}>
                    Smart Traffic System
                </Text>
                <TextInput defaultValue={this.props.username} underlineColorAndroid='transparent' placeholder='Username' style={{
                    marginHorizontal:10,
                    padding:15,
                    marginTop:'15%'
                }}
                onChangeText={(text)=>{
                    this.username = text; 
                }}
                />
                <TextInput defaultValue={this.props.password} underlineColorAndroid='transparent' placeholder='Password' style={{
                    marginHorizontal:10,
                    padding:15,
                }}
                secureTextEntry={true}
                onChangeText={(text)=>{
                    this.password = text; 
                }}
                />
                <TouchableOpacity style={{
                    marginHorizontal:10,
                    justifyContent:'center',
                    backgroundColor:'#435353',
                    alignItems:'center',
                    padding:15,
                    marginTop:'10%'
                }}
                onPress={(e)=>{
                    this.makeLogin();
                }}
                >
                    <Text>Login</Text>
                </TouchableOpacity>
                <Text style={{
                    alignSelf:'center',
                    marginTop:'5%'
                }}
                onPress={(e)=>{
                    this.goToSignUp();
                }}
                >
                    Not have account, click now!
                </Text>
            </View>
        )
    }


}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
        
    }
})