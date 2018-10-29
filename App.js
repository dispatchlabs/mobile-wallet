'use strict';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {NavigatorIOS, StyleSheet} from 'react-native';
import LoginPage from './LoginPage';
import HomePage from './HomePage';

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