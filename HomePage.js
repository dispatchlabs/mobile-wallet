'use strict'

import React, {Component} from 'react';
import {ActivityIndicator, ScrollView, StyleSheet, FlatList, NavigatorIOS, View, Button, Image,Text, TouchableHighlight} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import NewWalletPage from './NewWallet';
import ImportWalletPage from './ImportWallet';
import ActionButton from 'react-native-circular-action-menu';
import Icon from 'react-native-vector-icons/FontAwesome';
import TransferPage from './Transfer';

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

_keyExtractor = (item, index) => item.hash;

_toTransfer = () => {
	this.props.navigator.push({
      component: TransferPage,
      navigationBarHidden: false,
      title: 'Transfer',
      passProps: { address: this.props.address,
                   privkey: this.props.privkey}
      });
}

_initfunc(){
	this._executeTxsQuery('http://35.233.231.3:1975/v1/transactions');
	this._executeBalanceQuery('http://35.233.231.3:1975/v1/accounts/'+this.props.account); //+this.props.account ce31cdd5938370925e159eba18867b2a696137ae
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
  this.setState({ isLoading: false , message: '' });
  this.setState({ txs: response });
};

_onSearchPressed = () => {
  const query = urlForQueryAndPage('place_name', this.state.searchString, 1);
  this._executeQuery(query);
}

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
	 	const spinner = this.state.isLoading ? <ActivityIndicator size='large'/> : null;

	 	return (

	<LinearGradient start={{x: 1, y: 0}} end={{x: 0, y: 1}} colors={['#2C2E8B', '#74298C', '#D2508D']} style={styles.container}>

	<View style={styles.balance}>
		<Text style={styles.btitle}>Balance</Text>
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
          <ActionButton.Item buttonColor='#9b59b6' title="New Task" onPress={() => console.log("notes tapped!")}>
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