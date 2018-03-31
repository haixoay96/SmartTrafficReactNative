import React, {Component} from 'react';
import {View, Text,TextInput , TouchableOpacity, StyleSheet} from 'react-native';
import {Actions} from 'react-native-router-flux';
import Base from '../Base';
import {HOST} from '../../config';

export default class Login extends Base{
    constructor(props){
        super(props);
        this.username = '';
        this.password = '';
        this.repassword = '';

    }
    goToLogin = ()=>{
        Actions.Login();
    }
    makeSignUp = async ()=>{
        let username = this.username;
        let password = this.password;
        let repassword = this.repassword;
        if (username === '' || password=== ''){
            alert('Hoàn thiện username và password!');
            return;
        }
        if ( password !== repassword){
            alert('Nhập lại passoword không đúng!');
            return;
        }
        try{
            let result = await fetch(`${HOST}/signup`, {
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
                Actions.Login({
                    username:username,
                    password:password
                });
                return;
            }
            alert(JSON.stringify(data));
        }catch(e){
            alert(JSON.stringify(e));
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
                <TextInput underlineColorAndroid='transparent' placeholder='Username' style={{
                    marginHorizontal:10,
                    padding:15,
                    marginTop:'15%'
                }}
                    onChangeText={(text)=>{
                        this.username = text;
                    }}
                />
                <TextInput underlineColorAndroid='transparent' placeholder='Password' style={{
                    marginHorizontal:10,
                    padding:15,
                }}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.password = text;
                    }}
                />
                <TextInput underlineColorAndroid='transparent' placeholder='Repassword' style={{
                    marginHorizontal:10,
                    padding:15,
                }}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.repassword = text;
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
                        this.makeSignUp();
                    }}
                >
                    <Text>SignUp</Text>
                </TouchableOpacity>
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