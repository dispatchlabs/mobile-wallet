'use strict';

import React, {Component} from 'react';
import {StyleSheet, NavigatorIOS, View, Button, Image, ScrollView} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


export default class ImportWalletPage extends Component<{}> {

	 render() {
	 	return (
			<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
			<ScrollView horizontal>
			
			


			</ScrollView>
			</LinearGradient>

	)}

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});