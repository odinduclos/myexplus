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
   AsyncStorage,
   Dimensions,
   TouchableOpacity
 } from 'react-native';

import Button from 'react-native-button';
import CheckBox from 'react-native-check-box';
import HeaderConnexion from './components/HeaderConnexion';
const window = Dimensions.get('window');
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class Connexion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: '',
      username: '',
      password: '',
      rememberme: false,
      stayconnected: false,
      secureentry: true,
    }
    AsyncStorage.getItem('stayconnected', (err, result) => {
      if (result != undefined) {
        this.props.GoHome();
      }
    });
    AsyncStorage.getItem('mail', (err, result) => {
      if (result != undefined) {
        this.setState({
          username: result,
        })
      }
    });
    MessageBarManager.registerMessageBar(this.refs.alertconnexion);
  }
  _onPress() {
  Alert.alert('on Press!');
 }
 Connect() {
    fetch('http://www.pierreriche.com:8000/connexion', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mail: this.state.username,
        password: this.state.password,
      })
    })
  .then((response) => response.json())
  .then((data) => {
    if (data.message_err == undefined && data.message == undefined) {
      AsyncStorage.setItem('user_token', data.value);
      AsyncStorage.setItem('user_mail', data.user.mail);
      AsyncStorage.setItem('user_id', data.user.id.toString());
      if (this.state.stayconnected) {
        AsyncStorage.setItem('stayconnected', 'true');
      }
      if (this.state.rememberme) {
        AsyncStorage.setItem('mail', this.state.username);
      }
      this.props.GoHome()
    }
    else {
      MessageBarManager.registerMessageBar(this.refs.alertconnexion);
      MessageBarManager.showAlert({
        title: 'Une erreur est survenue',
        message: 'Veuillez vérifier votre saisie',
        alertType: 'warning',
      });
    }
  })
  .catch((error) => {
    console.warn(error, "loool");
    MessageBarManager.showAlert({
      title: 'Une erreur est survenue',
      message: 'Veuillez vérifier votre saisie',
      alertType: 'warning',
    });
  });
 }
  _handlePress(event) {
    var username=this.state.mail;
  }
 RememberMe(data) {
    return (
        <CheckBox
            style={{flex: 1, padding: 10}}
            onClick={()=> this.setState({rememberme: !this.state.rememberme})}
            isChecked={false}
            checkedImage={<Image source={require('./images/checkbox_checked_30x30.png')} />}
            unCheckedImage={<Image source={require('./images/checkbox_unchecked_30x30.png')} />}
        />);
  }
  StayConnected(data) {
     return (
         <CheckBox
             style={{flex: 1, padding: 10}}
             onClick={()=> this.setState({stayconnected: !this.state.stayconnected})}
             isChecked={false}
             checkedImage={<Image source={require('./images/checkbox_checked_30x30.png')} />}
             unCheckedImage={<Image source={require('./images/checkbox_unchecked_30x30.png')} />}
         />);
   }
   componentDidMount() {
     MessageBarManager.registerMessageBar(this.refs.alertconnexion);
   }

  componentWillUnmount() {
    MessageBarManager.unregisterMessageBar();
  }
  render() {
        return (
          <View style={styles.container}>
            <HeaderConnexion />
            <View style={{backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',}}>
              <TextInput
                onChangeText={(text) => this.setState({username: text})}
                value={this.state.username}
                style={styles.inputmail}
                underlineColorAndroid='transparent'
                placeholder='Votre adresse mail'
              />
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <TextInput
                  onChangeText={(text) => this.setState({password: text})}
                  secureTextEntry={this.state.secureentry}
                  value={this.state.password}
                  style={styles.inputpassword}
                  underlineColorAndroid='transparent'
                  placeholder='Votre mot de passe'
                  inlineImageLeft='images/23699'
                />
                <View style={{backgroundColor: 'rgba(0,0,0, 0.1)', height: 42, width: 50, marginTop: 20, marginLeft: 0, borderColor: 'grey', borderRadius: 2,}}>
                  <TouchableOpacity onPressIn={() => this.setState({secureentry: false})} onPressOut={() => this.setState({secureentry: true})}>
                    <Image source={require('./images/show_password_30x30.png')} style={{height: 25, width: 30, marginTop: 8, marginLeft: 10}} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View style={styles.inline_block}>
              <View style={{marginTop: 20, marginLeft: 60, height: 40, backgroundColor: 'white'}}>
                {this.RememberMe(false)}
              </View>
              <Text style={{marginTop: 33, marginLeft: 15, fontSize: 15, fontFamily: 'raleway_bold', color: "#8C8C8C" }}>Se souvenir de moi</Text>
            </View>
            <View style={styles.inline_block}>
              <View style={{marginTop: 20, marginLeft: 60, height: 40, backgroundColor: 'white'}}>
                {this.StayConnected(false)}
              </View>
              <Text style={{marginTop: 33, marginLeft: 15, fontSize: 15, fontFamily: 'raleway_bold', color: "#8C8C8C" }}>Rester connecté</Text>
            </View>
            <View style={{width: 292, marginLeft: 30, marginTop: 20, backgroundColor: 'white'}}>
              <Button onPress={(this.Connect.bind(this))}
              containerStyle={{padding:11, height:45, overflow:'hidden', borderRadius:22, backgroundColor: '#093996',}}
              style={{fontSize: 15, color: 'white', fontFamily: 'raleway'}}>
                Connexion
              </Button>
            </View>
            <View style={{alignItems: 'center', marginTop: 20, backgroundColor: 'white'}}>
              <TouchableOpacity onPress={this.props.onForward}>
                   <Text style={styles.underlineText} >Pas de compte ? Inscrivez vous.</Text>
               </TouchableOpacity>
             </View>
             <MessageBarAlert ref="alertconnexion" />
          </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white'
    },
    title: {
      fontSize: 30,
    },
    inputmail: {
        width: 300,
        padding: 5,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0, 0.1)',
        marginTop: 40,
        borderRadius: 2,
        paddingLeft: 10,
        fontFamily: 'raleway',
    },
    inputpassword: {
        width: 250,
        padding: 5,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0, 0.1)',
        marginTop: 20,
        paddingLeft: 10,
        fontFamily: 'raleway',
    },
    inline_block: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      backgroundColor: 'white',
    },
    underlineText: {
      textDecorationLine: "underline",
      textDecorationStyle: "solid",
      textDecorationColor: "#093996",
      color: '#B75493',
      fontFamily: 'raleway_bold',
      fontSize: 15,
    },
});

Connexion.propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    GoHome: PropTypes.func.isRequired,
};
