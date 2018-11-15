import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {TextInput, withTheme, Portal, Colors, Title, Button, Text} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import Base from '../Base';
import {HOST} from '../../config';

class SignUp extends Base{
    constructor(props){
        super(props);
        this.state = {
            username: '',
            password: '',
            repassword: ''
        }
       

    }
    goToLogin = ()=>{
        Actions.Login();
    }
    makeSignUp = async ()=>{
        let username = this.state.username;
        let password = this.state.password;
        let repassword = this.state.repassword;
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
        const {
            theme: {
              colors: { background },
            },
        } = this.props;
        return(
            <View style={[styles.container, {backgroundColor:background}]}>
                <Title style={{
                    alignSelf:'center',
                    marginTop:'20%',
                    fontSize:25
                }}>
                    Smart Traffic System
                </Title>
                <TextInput
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            username:text
                        })
                    }}
                    value={this.state.username}
                    mode='outlined'
                    label='Username' style={{
                    marginHorizontal:10,
                    marginTop:'15%'
                }}/>
                <TextInput 
                    mode='outlined'
                    value={this.state.password}
                    label='Password' style={{
                    marginHorizontal:10,
                    marginTop:5,
                }}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            password: text
                        })
                    }}
                />
                <TextInput 
                    mode='outlined'
                    label='Repassword' 
                    style={{
                        marginHorizontal:10,
                        marginTop:5
                    }}
                    value={this.state.repassword}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            repassword: text
                        })
                    }}
                />
                <Button 
                    mode='contained'
                    style={{
                        marginHorizontal:10,
                        marginTop:40,
                    }}
                    onPress={(e)=>{
                        this.makeSignUp();
                    }}
                >
                    SignUp
                </Button>
            </View>
        )
    }
}
export default withTheme(SignUp)
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#ffffff'
        
    }
})