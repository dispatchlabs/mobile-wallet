'use strict'

import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImportWalletPage from './ImportWallet';
import LinearGradient from 'react-native-linear-gradient';
import React, {Component} from 'react';
import TransferInfoPage from './TransferInfo';
import TransferPage from './Transfer';
import WalletPage from './Wallets';
import {AsyncStorage, ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight} from 'react-native';


export async function clearAsync(){
  AsyncStorage.clear();
};

export async function getKeys(){
  AsyncStorage.getAllKeys().then(console.log());
};

export async function saveItem(key, value){
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
};

export async function getItem(key){
  let item;
  try {_
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // We have data!!
      item = JSON.parse(value);
      return item;
    }
  } catch (error) {
    // Error retrieving data
    item = 'none';
    console.log(error.message);
  }
  item = 'none';
  return item;
}

export async function deleteItem(key){
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    // Error retrieving data
    console.log(error.message);
  }
}

//////////////////////////////////////////////////////////////////////////
// Main Class
export default class HomePage extends Component<{}> {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      message: '',
      txs: '',
      balance: 0,
    };
  }

  componentDidMount(){this._initfunc()};

  _keyExtractor = (item, index) => index;

  _toTransfer = () => {
    this.props.navigator.push({
      component: TransferPage,
      navigationBarHidden: false,
      title: 'Transfer',
      passProps: { address: this.props.address,
        privkey: this.props.privkey}
    });
  }

  _toWallets = () => {
    this.props.navigator.push({
      component: WalletPage,
      navigationBarHidden: false,
      title: 'Wallets',
      passProps: { address: this.props.address,
        privkey: this.props.privkey}
    });
  }

  _initfunc(){
    this._executeTxsQuery('http://127.0.0.1:3509/v1/transactions');
    this._executeBalanceQuery('http://127.0.0.1:3509/v1/accounts/'+this.props.address); //+this.props.account ce31cdd5938370925e159eba18867b2a696137ae
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

  _executeTxsQuery = (query) => {
    this.setState({ isLoading: true });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleTxsResponse(json.data))
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        }));
  };

  _handleTxsResponse = (response) => {
    console.log(response);
    this.setState({ isLoading: false , message: '' });
    this.setState({ txs: response });
  };

  _onPressItem = (index) => {
    console.log(index);

    this.props.navigator.push({
      component: TransferInfoPage,
      navigationBarHidden: false,
      title: 'Transfer Info',
      passProps: { hash: this.state.txs[index].hash,
        from: this.state.txs[index].from,
        to: this.state.txs[index].to,
        value: this.state.txs[index].value,
        time: this.state.txs[index].time,
        signature: this.state.txs[index].signature,
        herts: "0",
        status: this.state.txs[index].receipt.status,
      }
    });
  };

  _renderItem = ({item, index}) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
    />
  );

  render() {
    const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;

    return (

      <LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>

        <View style={styles.balance}>
          <Text style={styles.btitle}>{this.props.walletName}</Text>
          <Text style={styles.balanceText} adjustsFontSizeToFit minimumFontScale={.5} numberOfLines={1}>{this.state.balance}</Text>
          <View style={styles.line}/>
        </View>

        <View style={styles.txList}>
          {spinner}
          <Text style={styles.description}>{this.state.message}</Text>
          <FlatList
            data={this.state.txs}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            style={styles.txList}
          />
        </View>

        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={this._toWallets}>
            <Icon name="user-secret" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#3498db' title="Notifications" onPress={this._toTransfer}>
            <Icon name="usd" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item buttonColor='#1abc9c' title="All Tasks" onPress={() => {}}>
            <Icon name="gear" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>

      </LinearGradient>
    )}
}


////////////////////////////////////////////////////////////////////////
// List Class

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.index);
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


////////////////////////////////////////////////////////////////////////
// styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  actionButtonIcon: {
    fontSize: 20,
    height: 22,
    color: 'white',
  },
  balance: {
    height: '20%',
    top: '10%',
    alignItems: 'stretch',
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  balanceText:{
    color: 'rgba(0, 0, 0, 0.4)',
    textAlignVertical: "center",
    textAlign: "center",
    fontSize: 80,
  },
  line:{
    width:"80%",
    height:1,
    backgroundColor: "black",
    alignSelf: 'center',
    bottom:0,
    marginTop:5,
  },
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  separator: {
    height: 1,
    backgroundColor: 'black',
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    color: 'black'
  },
  rowContainer: {
    flexDirection: 'row',
    padding: 10
  },
  txList: {
    marginTop:'9%',
    height: '70%',
  },
  btitle: {
    fontSize: 40,
    color: 'black',
    textAlign: "center",
  },
});
