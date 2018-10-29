'use strict'

import React, {Component} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight, TextInput} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Buffer } from 'buffer';
import secp256k1 from 'secp256k1';
import keccak from 'keccak';



export default class TransferPage extends Component<{}> {

constructor(props) {
  super(props);
  this.state = {
    to: '',
    value: '',
    passwrd: '',
  };
}

_decrypt = (data, key) => {
    var algorithm = "aes256";
    var encoding = "base64";
    var decipher = crypto.createDecipher(algorithm, key);
    return decipher.update(data, encoding, "utf8") + decipher.final("utf8");
}

_stringToBuffer = (value) => {
        const bytes = [];
        for (let i = 0; i < value.length; i++) {
            bytes.push(value.charCodeAt(i));
        }
        return new Buffer(bytes);
    }

_numberToBuffer = (value) => {
        const bytes = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < bytes.length; i++) {
            const byte = value & 0xff;
            bytes [i] = byte;
            value = (value - byte) / 256;
        }
        return new Buffer(bytes);
    }

_onToChanged = (event) => {
	this.setState({ to: event.nativeEvent.text });
}

_onValueChanged = (event) => {
	this.setState({ value: event.nativeEvent.text });
}

_packageTx = () => {
	let now = new Date().getTime();
	console.log(this.props.address);
	const from = this._stringToBuffer(this.props.address);
    const to = this._stringToBuffer(this.state.to);
    const value = this._numberToBuffer(this.state.value);
    const time = this._numberToBuffer(now);

    hash = keccak('keccak256').update(Buffer.concat([Buffer.from('00', 'hex'), from, to, value, time])).digest();
    privateKey = this._decrypt(this.props.privkey, this.state.passwrd);
    const signature = secp256k1.sign(hash, Buffer.from(privateKey, 'hex'));
    const signatureBytes = new Uint8Array(65);
        for (let i = 0; i < 64; i++) {
            signatureBytes[i] = signature.signature[i];
        }
        signatureBytes[64] = signature.recovery;
    const sig = new Buffer(signatureBytes).toString('hex');
}

_sendTx = (event) => {
	this.setState({ passwrd: event.nativeEvent.text }, function(newState) {
		this._packageTx();

	}.bind(this));
}

_executeBalanceQuery = (query) => {
  fetch(query)
  .then(response => response.json())
  .then(json => this._handleBalanceResponse(json.data))
  .catch();
};

_handleBalanceResponse = (response) => {
  this.setState({ balance: response.balance });
};

render() {
	 	
	 	return (
			<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
	<View style={styles.wrap}>
				<TextInput
    				style={styles.searchInput}
    				placeholder='send to'
    				placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
    				textAlign={'center'}
    				onChange={this._onToChanged}
    				/>
				<TextInput
    				style={styles.searchInput}
    				placeholder='how much'
    				placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
    				textAlign={'center'}
    				onChange={this._onValueChanged}
    				/>
    			<TextInput
    				style={styles.searchInput}
    				placeholder='supa secrt passwerd'
    				placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
    				secureTextEntry = {true}
    				textAlign={'center'}
    				onSubmitEditing={(event) =>  this._sendTx(event)}
    				/>
    </View>

</LinearGradient>
	 		)}
}


const styles = StyleSheet.create({
container: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  searchInput: {
  	alignSelf: 'stretch',
  	height: 36,
  	padding: 4,
  	flexGrow: 1,
  	fontSize: 18,
  },
  wrap: {
  	paddingTop: 100,
  	justifyContent: 'flex-start',
  },
  });