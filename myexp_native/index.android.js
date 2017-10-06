/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  AlertIOS,
  TextInput,
  Navigator,
  AsyncStorage,
  StatusBar,
  BackAndroid
} from 'react-native';

import Connexion from './src/Connexion';
import Inscription from './src/Inscription';
import Home from './src/Home';
import ShowStage from './src/ShowStage';
import Stats from './src/Stats';


export default class myexp_native extends Component {
  _renderScene(route, navigator) {
    if (route.title == 'Connexion') {
      return <Connexion
          title={route.title}
          onForward={() => {
            const nextIndex = route.index + 1;
            navigator.push({
              title: 'Inscription',
              index: nextIndex,
            });
          }}
          GoHome={() => {
            const nextIndex = route.index + 2;
            navigator.push({
              title: 'Home',
              index: nextIndex,
              gestures: false,
            });
          }}
          onBack={() => {
              navigator.pop({
                title: 'Home',
                gestures: false,
              });
          }}
      />
    }
    if (route.title == 'Home') {
      return <Home
          title={route.title}
          donnee={'ere'}
          showStage={(id) => {
            navigator.push({
              title: 'showStage',
              donnee: id,
            });
          }}
          showStats={() => {
            navigator.push({
              title: 'showStats',
              index: 4,
            });
          }}
          onBack={() => {
              navigator.pop({
                title: 'Connexion',
                gestures: false,
              });
          }}
      />
    }
    if (route.title == 'Inscription') {
      return <Inscription
          title={route.title}
          onForward={() => {
            route.index = 1;
            navigator.push();
          }}
          onBack={() => {
              navigator.pop({
                title: 'Home',
                index: 3,
              });
          }}
      />
    }
    if (route.title == 'showStage') {
      return <ShowStage
          donnee={route.donnee}
          title={route.title}
          onBack={() => {
              navigator.pop({
                title: 'Home',
                index: 3,
              });
          }}
      />
    }
    if (route.title == 'showStats') {
      return <Stats
          title={route.title}
          onBack={() => {
              navigator.pop({
                title: 'Home',
                index: 4,
              });
          }}
          Disconnect={() => {
              navigator.pop();
              navigator.pop({
                title: 'Connexion',
                index: 0,
              });
          }}
      />
    }
  }
  componentWillMount() {
    StatusBar.setHidden(true);
  }
  componentDidMount() {
    BackAndroid.addEventListener('hardwareBackPress', this.handleBack);
  }

  componentWillUnmount() {
    BackAndroid.removeEventListener('hardwareBackPress', this.handleBack);
  }
  handleBack() {
    if (navigator && navigator.getCurrentRoutes().length > 2) {
      navigator.pop();
      return true;
    }
    return false;
  }
  render() {
    return (
      <Navigator
            initialRoute={{ title: 'Connexion', index: 0 }}
            renderScene={this._renderScene}
            configureScene={(route) => {
              if (route.index == 2) {
                var sceneConfig = Navigator.SceneConfigs.FloatFromBottom;
                sceneConfig.gestures.pop = {};
                return sceneConfig;
              }
              else {
                return Navigator.SceneConfigs.PushFromRight;
              }
            }}
            ref={(nav) => { navigator = nav }}
        />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('myexp_native', () => myexp_native);
