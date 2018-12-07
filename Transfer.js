'use strict'

import ErrorPage from "./ErrorPage";
import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import TransferInfoPage from "./TransferInfo";
import crypto from 'react-native-crypto';
import keccak from 'keccak';
import secp256k1 from 'secp256k1';
import {Buffer} from 'buffer';
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight, TextInput} from 'react-native';


export default class TransferPage extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      to: '',
      value: '',
      passwrd: '',
      status: '',
      hash: '',
      time: '',
      signature: '',
      herts: '',
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
    let bytes = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < bytes.length; i++) {
      let byte = value & 0xff;
      bytes [i] = byte;
      value = (value - byte) / 256;
    }
    return Buffer.from(bytes);
  }

  _getInt64Bytes = ( x ) => {
    var bytes = [];
    var i = 8;
    do {
      bytes[--i] = x & (255);
      x = x>>8;
    } while ( i )
    return new Buffer(bytes);
  }

  _onToChanged = (event) => {
    this.setState({ to: event.nativeEvent.text });
  }

  _onValueChanged = (event) => {
    this.setState({ value: event.nativeEvent.text });
  }

  _sendTx = (event) => {
    this.setState({ passwrd: event.nativeEvent.text }, function(newState) {
      let now = new Date().getTime();
      const from = Buffer.from(this.props.address, 'hex');
      const to = Buffer.from(this.state.to, 'hex');
      const val = this.state.value
      const value = Buffer.from(val);
      const time = this._numberToBuffer(now);

      const hash = keccak('keccak256').update(Buffer.concat([Buffer.from('00', 'hex'), from, to, value, time])).digest();
      const privateKey = this._decrypt(this.props.privkey, this.state.passwrd);

      const signature = secp256k1.sign(hash, Buffer.from(privateKey, 'hex'));
      const signatureBytes = new Uint8Array(65);
      for (let i = 0; i < 64; i++) {
        signatureBytes[i] = signature.signature[i];
      }
      signatureBytes[64] = signature.recovery;
      const sig = new Buffer(signatureBytes).toString('hex');

      this.setState({ hash: hash });
      this.setState({ time: now });
      this.setState({ signature: sig });
      this.setState({ herts: "0" });

      fetch('http://127.0.0.1:3509/v1/transactions', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hash: hash.toString('hex'),
          type: 0,
          from: this.props.address,
          to: this.state.to,
          value: val,
          time: now,
          signature: sig,
          hertz: "0",
        }),
      }).then(response => response.json())
        .then(json => this._handleTxResponse(json))
        .catch();
    }.bind(this));
  }

  _handleTxResponse = (response) => {
    if (response.status == "Pending") {
      this.props.navigator.push({
        component: TransferInfoPage,
        navigationBarHidden: false,
        title: 'Transfer Info',
        passProps: { hash: this.state.hash,
          from: this.props.address,
          to: this.state.to,
          value: this.state.value,
          time: this.state.time,
          signature: this.state.signature,
          herts: "0",
          status: response.status,
        }
      });
    } else {
      this.props.navigator.push({
        component: ErrorPage,
        navigationBarHidden: false,
        title: 'Wallets',
        passProps: { status: response.status,
          HumanReadableStaus: response.HumanReadableStatus}
      });
    }
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

          <View style={styles.line}/>

          <TextInput
            style={styles.searchInput}
            placeholder='how much'
            placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
            textAlign={'center'}
            onChange={this._onValueChanged}
          />

          <View style={styles.line}/>

          <TextInput
            style={styles.searchInput}
            placeholder='supa secrt passwerd'
            placeholderTextColor = 'rgba(255, 255, 255, 0.5)'
            secureTextEntry = {true}
            textAlign={'center'}
            onSubmitEditing={(event) =>  this._sendTx(event)}
          />

          <View style={styles.line}/>
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
  },line:{
    width:"80%",
    height:1,
    backgroundColor: "black",
    alignSelf: 'center',
    bottom:0,
    marginTop:5,
  },
});
