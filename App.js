'use strict';

import HomePage from './HomePage';
import LoginPage from './LoginPage';
import React, {Component} from 'react';
import {NavigatorIOS, StyleSheet} from 'react-native';

export default class App extends Component<{}> {
  render() {
    return (
      <NavigatorIOS
        style={styles.container}
        navigationBarHidden
        initialRoute={{
          title: 'LoginPage',
          component: LoginPage,
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
