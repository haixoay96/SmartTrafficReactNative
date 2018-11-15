import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import {TextInput, withTheme, Portal, Colors, Title, Button, Text} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import Base from '../Base';
import {HOST} from '../../config';
class Login extends Base{
    constructor(props){
        super(props);
        this.state = {
            username: this.props.username?this.props.username:'',
            password: this.props.password?this.props.password:''
        }
    }
    goToSignUp = ()=>{
        Actions.SignUp();
    }
    makeLogin = async ()=>{
        let username = this.state.username;
        let password = this.state.password;
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
        const {
            theme: {
              colors: { background },
            },
        } = this.props
        return(
            <View style={[styles.container, {backgroundColor:background}]}>
                <Title style={{
                    alignSelf:'center',
                    marginTop:'20%',
                    fontSize:25
                }}>
                    Smart Traffic
                </Title>
                <TextInput 
                mode='outlined'
                    style={{
                        marginHorizontal:10,
                        marginTop:'15%'
                    }}
                    label='Username'
                    value={this.state.username}
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            username: text
                        })
                    }}
                />
                <TextInput
                    mode='outlined'
                    style={{
                        marginTop:5,
                        marginHorizontal:10,
                    }}
                    label='Password'
                    value={this.state.password}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            password: text
                        })
                    }}
                />
                <Button 
                    style={{
                        marginTop:40,
                        marginHorizontal:10,
                    }}
                    mode="contained" 
                    onPress={(e)=>{
                        this.makeLogin();
                    }}
                >   
                   Login
                </Button>
                <Text style={{
                    alignSelf:'center',
                    marginTop:40
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

export default withTheme(Login)
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: Colors.white
    }
})