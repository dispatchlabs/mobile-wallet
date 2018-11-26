'use strict';

import React, { Component } from 'react'
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import HomePage from './HomePage';


export default class TransferInfoPage extends Component<{}> {
  
	componentDidMount(){this._initfunc()};

	_initfunc() {
			this.props.navigator.replacePrevious({ 
  			component: HomePage 
		});

	};

  render() {
    return (
    	<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
    		<View style={styles.infoHolder}>
    			<Text style= {styles.info}> Hash: {this.props.hash} </Text>
    			<Text style= {styles.info}> From: {this.props.from} </Text>
    			<Text style= {styles.info}> To: {this.props.to} </Text>
    			<Text style= {styles.info}> Value: {this.props.value}</Text>
    			<Text style= {styles.info}> Time: {this.props.time}</Text>
    			<Text style= {styles.info}> Signature: {this.props.signature}</Text>
    			<Text style= {styles.info}> Hertz: {this.props.hertz}</Text>
    			<Text style= {styles.info}> Status: {this.props.status}</Text>
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