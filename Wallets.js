'use strict'

import HomePage, {saveItem, getItem, deleteItem} from './HomePage';
import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import {AsyncStorage, ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight} from 'react-native';

export default class WalletPage extends Component<{}> {
  _getWallets = async () => {
    let wallets = [];
    const walletList = await getItem('WalletList');
    console.log(walletList);
    for (var i = 0; i < walletList.length; i++) {
      wallets.push(await getItem(walletList[i]));
    }
    console.log(wallets)
    return wallets
  }

  async _setDefault(newKey){
    await deleteItem('defaultWallet');
    const defWallet = await getItem(newKey);
    await setItem('defaultWallet', defWallet);
    if (defWallet != 'none') {
      this.props.navigator.push({
        component: HomePage,
        navigationBarHidden: true,
        title: 'Home',
        passProps: {
          walletName: defWallet.nickName,
          address: defWallet.address,
          privkey: defWallet.privateKey
        }
      });
    }
  };

  _keyExtractor = (item, index) => item.address;

  _onPressItem = (index) => {
    console.log("Pressed row: "+index);
  };

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  render() {
    return (
      <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>
        <View style={styles.txList}>
          <Text style={styles.description}>something</Text>
          <FlatList
            data={this._getWallets()}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            style={styles.txList}
          />
        </View>
      </LinearGradient>
    )}
}

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item.from);
  }

  render() {
    const item = this.props.item;
    const value = item.value;
    return (
      <TouchableHighlight
        onPress={this._onPress}
        underlayColor='#dddddd'>
        <View>
          <View style={styles.rowContainer}>
            <Text style={styles.title}>{item.from} sent {value} to {item.to}</Text>
          </View>
          <View style={styles.separator}/>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
