import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, AsyncStorage} from 'react-native';
import {TextInput, withTheme, Portal, Colors, Title, Button, Text} from 'react-native-paper';
import {Actions} from 'react-native-router-flux';
import Base from '../Base';
import {HOST} from '../../config';
class ChangePass extends Base{
    constructor(props){
        super(props);
        this.state = {
            password: '',
            new_password: ''
        }
    }
    changePass = async ()=>{
        let password = this.state.password;
        let new_password = this.state.new_password;
        if (password === '' || new_password=== ''){
            alert('Hoàn thiện password và new password!');
            return;
        }
        try{
            let username = await AsyncStorage.getItem('username');
            let result = await fetch(`${HOST}/changepassword`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username:username,
                    password:password,
                    new_password: new_password
                })
            });
            let data = await result.json();
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
                    label='password'
                    value={this.state.password}
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
                    style={{
                        marginTop:5,
                        marginHorizontal:10,
                    }}
                    label='new password'
                    value={this.state.new_password}
                    secureTextEntry={true}
                    onChangeText={(text)=>{
                        this.setState({
                            ...this.state,
                            new_password: text
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
                        this.changePass();
                    }}
                >   
                   Change
                </Button>
                {/* <Text style={{
                    alignSelf:'center',
                    marginTop:40
                }}
                onPress={(e)=>{
                    
                }}
                >
                    Not have account, click now!
                </Text> */}
            </View>
        )
    }


}

export default withTheme(ChangePass)
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor: Colors.white
    }
})