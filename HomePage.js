'use strict'

import React, {Component} from 'react';
import {StyleSheet, NavigatorIOS, View, Button, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewWalletPage from './NewWallet';
import ImportWalletPage from './ImportWallet';

export default class LoginPage extends Component<{}> {

	_sendTx = () => {
		this.props.navigator.push({
			component: ImportWalletPage,
			navigationBarHidden: false,
      		title: 'Import Wallet',
    	});
	}

	_packageTx = () => {
		
	}

	 render() {
	 	return (
	<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>


	</LinearGradient>
	)}
	 }

const styles = StyleSheet.create({
container: {
    flex: 1,
  },
});