'use strict';

import React, {Component} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class ErrorPage extends Component<{}> {
  

  render() {
    return (
    	<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
    		<View style={styles.infoHolder}>
    			<Text style= {styles.info}> status: {this.props.status} </Text>
    			<Text style= {styles.info}> Human Readable Status: {this.props.HumanReadableStatus} </Text>
    		</View>
      	</LinearGradient>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoHolder:{
  	height: '80%',
  	alignItems: 'stretch',
  	justifyContent: 'flex-end',
  },
  info:{
  	fontSize: 20,
  },

 });