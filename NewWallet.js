'use strict';

import React, {Component} from 'react';
import {StyleSheet, NavigatorIOS, View, Button, Image, ScrollView, TextInput, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import crypto from 'react-native-crypto';
import { Buffer } from 'buffer';
import secp256k1 from 'secp256k1';
import HomePage from './HomePage';
import keccak from 'keccak';



export default class NewWalletPage extends Component<{}> {

constructor(props) {
  super(props);
  this.state = {
    passwrd: '',
    address: '',
    privkey: '',
  };
}

 _encrypt= (data, key) => {
    var algorithm = "aes256";
    var encoding = "base64";
    var cipher = crypto.createCipher(algorithm, key);
    return cipher.update(data, "utf8", encoding) + cipher.final(encoding);
}

 _toAddress = (publicKey) => {
        // Hash publicKey.
        const hashablePublicKey = new Buffer(publicKey.length - 1);
        for (let i = 0; i < hashablePublicKey.length; i++) {
            hashablePublicKey[i] = publicKey[i + 1];
        }
        const hash = keccak('keccak256').update(hashablePublicKey).digest();

        // Create address.
        const address = new Buffer(20);
        for (let i = 0; i < address.length; i++) {
            address[i] = hash[i + 12];
        }
        return address;
    }


_onSubmit = (event) => {
  	this.setState({ passwrd: event.nativeEvent.text }, function(newState) {

    let privateKey = new Buffer(32);
    do {
            privateKey = crypto.randomBytes(32);
        } while (!secp256k1.privateKeyVerify(privateKey));
        const publicKey = secp256k1.publicKeyCreate(privateKey, false);
    this.setState({ address: this._toAddress(publicKey).toString('hex') }, function(newState) {
    var encryptedData = this._encrypt(Buffer.from(privateKey).toString('hex'), this.state.passwrd);
    this.props.navigator.push({
      component: HomePage,
      navigationBarHidden: true,
      title: 'Home',
      passProps: { 
                   address: this.state.address,
                   privkey: encryptedData}
      });
    }.bind(this));
    }.bind(this));
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
    				placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
    				secureTextEntry = {true}
    				textAlign={'center'}
    				onSubmitEditing={(event) =>  this._onSubmit(event)}
    				/>
    			<View style={styles.line}/>
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

