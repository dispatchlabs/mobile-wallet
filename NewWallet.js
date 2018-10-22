'use strict';

import React, {Component} from 'react';
import {StyleSheet, NavigatorIOS, View, Button, Image, ScrollView, TextInput, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import crypto from 'react-native-crypto';

export default class NewWalletPage extends Component<{}> {

constructor(props) {
  super(props);
  this.state = {
    passwrd: ''
  };
}

_onSubmit = (event) => {
  	this.setState({ passwrd: event.nativeEvent.text });
}

_temp = (event) => {
  this.props.navigator.push({
      component: HomePage,
      navigationBarHidden: true,
          title: 'New Wallet',
      });
}

 render() {
	 	return (
	 		<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
	 		<Image source={require('./Resources/logo-white.png')} style={styles.image} resizeMode="contain"/>

	 		<View style={styles.flowRight}>
	 		<Text style={styles.font}>
	 			Let's secure your wallet
	 		</Text>
  				<TextInput
    				style={styles.searchInput}
    				placeholder='supa secrt passwerd'
    				placeholderTextColor = 'rgba(255, 2555, 255, 0.5)'
    				secureTextEntry = {true}
    				textAlign={'center'}
    				onSubmitEditing={(event) =>  this._onSubmit(event)}
    				/>
    			<View style={styles.line} />
			</View>







	 		<ScrollView horizontal>
			</ScrollView>
			</LinearGradient>
			
	)}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
  	paddingTop: 100,
  	alignSelf: 'center',
  	maxWidth: "80%",
  },
  flowRight:{
  	alignItems:'center'
  },
  searchInput: {
  	alignSelf: 'stretch',
  	height: 36,
  	padding: 4,
  	flexGrow: 1,
  	fontSize: 18,
  },
  line: {
  	width:"80%",
  	height:1,
  	backgroundColor: "black",
  }
});

