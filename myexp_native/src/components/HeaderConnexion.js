import React, { Component, PropTypes } from 'react';
import {
   View,
   Text,
   TouchableHighlight,
   Html5,
   ScrollView,
   StyleSheet,
   ListView,
   Image,
   TextInput,
   Alert,
   ListItem,
   Body,
   Content,
   AsyncStorage
 } from 'react-native';
export default class HeaderConnexion extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', height: 220}}>
        <Image source={require('../images/photo_connexion_01_412x275.png')}
        style={{padding: 0, margin: 0}}>
        <Image source={require('../images/logo_150x140.png')}
        style={{marginLeft: 110, marginTop: 40}} />
        </Image>
        <Image source={require('../images/element_montagne_40x70.png')}
        style={{position: 'absolute', top: 190, left: 50}} />
        <Image source={require('../images/element_triangle_15x15.png')}
        style={{position: 'absolute', top: 210, left: 280}} />
      </View>
        )
    }
}
const styles = StyleSheet.create({

});

HeaderConnexion.propTypes = {
};
