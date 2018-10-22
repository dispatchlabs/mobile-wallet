'use strict';

import React, {Component} from 'react';
import {StyleSheet, NavigatorIOS, View, Button, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewWalletPage from './NewWallet';
import ImportWalletPage from './ImportWallet';

export default class LoginPage extends Component<{}> {

	_haveWalletClicked = () => {
		this.props.navigator.push({
			component: ImportWalletPage,
			navigationBarHidden: false,
      		title: 'Import Wallet',
    	});
	}

	_dontHaveWalletClicked = () => {
		this.props.navigator.push({
			component: NewWalletPage,
			navigationBarHidden: false,
      		title: 'New Wallet',
    	});
	}

	 render() {
	 	return (
	<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
      <Image source={require('./Resources/logo-white.png')} style={styles.image} resizeMode="contain"/>

        <View style={styles.buttons}>
        	<View style={styles.button}>
        		<Button
 					onPress={this._haveWalletClicked}
  					title="I have a wallet"
  					color="black"
  					accessibilityLabel="I have a wallet"
				/>
			</View>
  			<View style={[styles.button,{borderColor: 'rgba(0, 0, 0, 0.1)',
    borderTopWidth: 1}]}>
        		<Button
 					onPress={this._dontHaveWalletClicked}
  					title="I don't have a wallet"
  					color="black"
  					accessibilityLabel="I don't have a wallet"
  				/>
			</View>
        </View>
    </LinearGradient> 
    )
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    fontSize: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding:20,
    
  },
  buttons: {
  	position: 'absolute',
  	bottom: 0,
  	left: 0,
  	width: "100%",
  },
  image: {
  paddingTop: 100,
  alignSelf: 'center',
  maxWidth: "80%",
  },
});