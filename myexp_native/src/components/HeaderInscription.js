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
export default class HeaderInscription extends Component {
  render() {
    return (
      <View style={{backgroundColor: 'white', height: 157 }}>
          <Image source={require('../images/photo_inscription_01_412x275.png')}
        style={{ padding: 0, margin: 0, height: 157}}>
        <Image source={require('../images/logo_150x140.png')}
        style={{marginLeft: 165, marginTop:25, height:107, width:99 }} />
        </Image>
        <Image source={require('../images/element_montagne_40x70.png')}
        style={{position: 'absolute', top: 117, left: 55 }} />
        <Image source={require('../images/element_triangle_15x15.png')}
        style={{position: 'absolute', top: 143, left: 310}} />
      </View>
        )
    }
}
const styles = StyleSheet.create({

});

HeaderInscription.propTypes = {
};
