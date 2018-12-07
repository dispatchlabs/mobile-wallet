'use strict';

import HomePage, {saveItem, getItem} from './HomePage';
import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import crypto from 'react-native-crypto';
import keccak from 'keccak';
import secp256k1 from 'secp256k1';
import {AsyncStorage, StyleSheet, NavigatorIOS, View, Button, Image, ScrollView, TextInput, Text} from 'react-native';
import {Buffer} from 'buffer';

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
    console.log("On Submit");
    this.setState({ passwrd: event.nativeEvent.text }, function(newState) {
      let wallet = {
        nickname: '',
        address: '',
        privateKey: '',
      };

      let privateKey = new Buffer(32);
      do {
        privateKey = crypto.randomBytes(32);
      } while (!secp256k1.privateKeyVerify(privateKey));

      console.log(`PrivKey: ${privateKey}`);

      const publicKey = secp256k1.publicKeyCreate(privateKey, false);
      this.setState({ address: this._toAddress(publicKey).toString('hex') }, async function(newState) {
        wallet.nickname = 'Wallet';
        wallet.address = this.state.address;
        wallet.privateKey = await this._encrypt(Buffer.from(privateKey).toString('hex'), this.state.passwrd);

        let walletList = await getItem('WalletList');

        console.log(walletList);
        console.log(wallet);

        if (walletList != 'none') {
          walletList.push(wallet.nickname);
          deleteItem('WalletList');
          saveItem('WalletList', walletList);
        } else {
          let walletList = [wallet.nickname];
          await saveItem('WalletList', wallet.nickname);
          console.log(walletList)
          await getItem('WalletList');
          console.log(walletList)
        }

        saveItem(wallet.nickname, wallet);
        saveItem('defaultWallet', wallet);
        saveItem('WalletList', wallet.nickname);

        this.props.navigator.push({
          component: HomePage,
          navigationBarHidden: true,
          title: 'Home',
          passProps: {
            walletName: wallet.nickname,
            address: wallet.address,
            privkey: wallet.privateKey
          }
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
            placeholder='Enter Password'
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

