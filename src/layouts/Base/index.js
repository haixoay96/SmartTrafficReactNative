import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal
} from 'react-native';

export default class Base extends Component<{}>{
    render(){
        return(
            <View style={styles.container}>
                {this.renderContent()}
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
    }
});