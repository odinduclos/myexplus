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
 TouchableOpacity
} from 'react-native';

import Button from 'react-native-button';
import CheckBox from 'react-native-check-box';
import Orientation from 'react-native-orientation';
import renderIf from './functions/renderIf';
import SideMenu from 'react-native-side-menu';
import Menu from './components/Menu';
var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

export default class Stats extends Component {
  constructor(props) {
    super(props);
    this.state = {
        stages: [],
        enterprise: [],
        compbystage: [],
        notebystage: [],
        isOpen: false,
    }
    AsyncStorage.getItem('user_token', (err, result) => {
        AsyncStorage.getItem('user_id', (err2, result2) => {
            this.setState({token: result});
            fetch('http://www.pierreriche.com:8000/stagiaireinfo/' + result2, {
                method: 'get',
                headers: {
                    'X-Auth-Token': result,
                }
            })
            .then((response) => response.json())
            .then((dat) => {
                fetch('http://www.pierreriche.com:8000/mystages/' + dat.id, {
                    method: 'get',
                    headers: {
                        'X-Auth-Token': result,
                    }
                })
                .then((response) => response.json())
                .then((data) => {
                    for (var len = 0; len < data.length; len++) {
                        if (len == 0) {
                            var newData = this.state.stages.concat([data[len].id_stage]);
                        }
                        else {
                            newData = newData.concat([data[len].id_stage]);
                        }
                    }
                    var job = [];
                    for (var l = 0; l < data.length; l++) {
                        // console.warn(data[l].id_stage.id, result);
                        this.getNameOfEnterprise(data[l].id_stage.id, result);
                        this.getCompForStage(data[l].id_stage.id, result);
                    }
                    if (newData == undefined) {
                      var newData = [];
                    }
                    this.setState({stages: newData});
                    // console.warn(this.state.enterprise, this.state.stages);
                })
                .catch((error) => {
                    // console.warn(error);
                });
            })
            .catch((error) => {
                // console.warn(error);
                MessageBarManager.registerMessageBar(this.refs.alerterror);
                MessageBarManager.showAlert({
                  title: 'Erreur serveur',
                  message: 'Veuillez vérifier votre connexion internet',
                  alertType: 'error',
                });
            });
        });
    });

}
componentDidMount() {
    MessageBarManager.registerMessageBar(this.refs.alerterror);
}

componentWillUnmount() {
   MessageBarManager.unregisterMessageBar();
}
toggle() {
  this.setState({
    isOpen: !this.state.isOpen,
  });
}

updateMenuState(isOpen) {
  this.setState({ isOpen, });
}

onMenuItemSelected = (item) => {
  this.setState({
    isOpen: false,
  });
}
openMenu() {
  this.setState({
    isOpen: !this.state.isOpen,
  });
}
getCompForStage(id, token) {
  fetch('http://www.pierreriche.com:8000/mycompetences/' + id, {
   method: 'get',
   headers: {
     'X-Auth-Token': token,
   }
 })
 .then((response) => response.json())
 .then((dat) => {
    var countNote = 0;
    var countEval = 0;
    var Note = 0;
    var Eval = 0;
    for (var l = 0; l < dat.length; l++) {
      countNote++;
      countEval++;
      Note += dat[l].competence_stagiaire;
      Eval += dat[l].note_stagiaire;
    }
    Note = Math.round(Note/countNote);
    Eval = Math.round(Eval/countEval);
    var value = Eval;
    var value2 = Note;
    this.setState({
      compbystage: this.state.compbystage.concat([value2]),
       notebystage: this.state.notebystage.concat([value])
     });
 })
 .catch((error) => {
   console.warn(error);
 });
}
getNameOfEnterprise(id, token) {
    var value = null;
    fetch('http://www.pierreriche.com:8000/stageformaitredestage/' + id, {
        method: 'get',
        headers: {
            'X-Auth-Token': token,
        }
    })
    .then((response) => response.json())
    .then((dataa) => {
        value = dataa.id_maitre_de_stage.nom_entreprise;
        // console.warn(dataa.id_maitre_de_stage.nom_entreprise);
        this.setState({enterprise: this.state.enterprise.concat([value])});
    })
    .catch((error) => {
        // console.warn(error);
    });
}
generateEval(evaluation) {
  if (evaluation == 1) {
    return <View style={{width: 25, height: 20, backgroundColor: '#b45596'}}></View>
  }
  else if (evaluation == 2) {
    return <View style={{width: 50, height: 20, backgroundColor: '#b45596'}}></View>
  }
  else if (evaluation == 3) {
    return <View style={{width: 75, height: 20, backgroundColor: '#b45596'}}></View>
  }
  else if (evaluation == 4) {
    return <View style={{width: 100, height: 20, backgroundColor: '#b45596'}}></View>
  }
  else if (evaluation == 5) {
    return <View style={{width: 125, height: 20, backgroundColor: '#b45596'}}></View>
  }
  else {
    return <View style={{width: 0, backgroundColor: '#b45596'}}></View>
  }
}
generateNote(evaluation) {
  if (evaluation == 1) {
    return <View style={{width: 25, height: 20, backgroundColor: '#f5b450'}}></View>
  }
  else if (evaluation == 2) {
    return <View style={{width: 50, height: 20, backgroundColor: '#f5b450'}}></View>
  }
  else if (evaluation == 3) {
    return <View style={{width: 75, height: 20, backgroundColor: '#f5b450'}}></View>
  }
  else if (evaluation == 4) {
    return <View style={{width: 100, height: 20, backgroundColor: '#f5b450'}}></View>
  }
  else if (evaluation == 5) {
    return <View style={{width: 125, height: 20, backgroundColor: '#f5b450'}}></View>
  }
  else {
    return <View style={{width: 0, backgroundColor: '#f5b450'}}></View>
  }
}
deconnexion() {
  AsyncStorage.removeItem('user_id', (err, result2) => {
    AsyncStorage.removeItem('user_token', (err2, result2) => {
      AsyncStorage.removeItem('stayconnected', (err3, result3) => {
        if (!err && !err2 && !err3) {
          this.props.Disconnect();
        }
      });
    });
  });
}
  goStats() {

  }
  render() {
    count = -1;
    if (this.state.stages == undefined) {
          return(
                <View style={styles.container}>
                      <View style={{  height: 50, backgroundColor: "white", flexDirection: "row" }}>
                            <TouchableOpacity onPress={this.openMenu.bind(this)}>
                              <Image source={require('./images/menu_30x30.png')} style={{ marginLeft: 20, marginTop: 10 }} />
                            </TouchableOpacity>
                            <Text style={{ fontFamily:"raleway_bold", color:"#00379b", marginLeft: 120, marginTop: 17.5 }}>Ma progression</Text>
                      </View>
                      <Image source={require('./images/photo_nostage_412x682.png')} style={{ alignItems: "center" }}>
                            <Text style={{ fontFamily:"raleway", color:"black", width: 200, fontSize: 24, marginTop: 100 }}>Vous navez pas encore évalué de compétence.</Text>
                      </Image>
                </View>
          )
    }
    else {
        return (
          <View style={styles.container}>
              <View style={{flexDirection: "row", backgroundColor: 'white', height: 50}}>
                    <TouchableOpacity onPress={this.props.onBack}>
                      <Image source={require('./images/display_10x20.png')} style={{ marginTop: 20, marginLeft: 15, transform: [{ rotate: '90deg'}] }} />
                    </TouchableOpacity>
                    <Text style={{ fontFamily:"raleway_bold", color:"#00379b", marginLeft: 90, marginTop: 17.5}}>Ma progression</Text>
              </View>
            <ScrollView>
              <View style={{marginTop: 30, marginBottom: 20,backgroundColor: "white", flexDirection: "row" }}>
                <Text style={{fontFamily: 'raleway', marginLeft: 90, color: 'black'}}>Stages</Text>
                <Text style={{fontFamily: 'raleway', marginLeft: 120, color: 'black'}}>Moyennes</Text>
              </View>
              <View style={{flexDirection: 'row', marginLeft: 220}}>
                <View style={{height: 35, width: 3, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 3, width: 23, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 9, width: 3, backgroundColor: "#e6e6e6", marginTop: -3}}></View>
                <View style={{height: 3, width: 23, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 9, width: 3, backgroundColor: "#e6e6e6", marginTop: -3}}></View>
                <View style={{height: 3, width: 23, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 9, width: 3, backgroundColor: "#e6e6e6", marginTop: -3}}></View>
                <View style={{height: 3, width: 23, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 9, width: 3, backgroundColor: "#e6e6e6", marginTop: -3}}></View>
                <View style={{height: 3, width: 23, backgroundColor: "#e6e6e6"}}></View>
                <View style={{height: 9, width: 3, backgroundColor: "#e6e6e6", marginTop: -3}}></View>
              </View>
            {this.state.stages.map((item) => {
            count++;
            console.warn(item.id);
            return <View key={item.id} style={{ backgroundColor: 'white', flexDirection: 'row', margin: 0}}>
                  <View style={{ marginLeft: 40, backgroundColor: 'white', width: 140, alignItems: "flex-start"}}>
                    <Text style={{fontFamily: 'raleway_medium', color: '#00379b', fontSize: 16 }}>{item.id_metier.titre}</Text>
                    <Text style={{ fontSize: 10, fontFamily: 'raleway_semibold', color: '#b45596'}}>
                          du {item.date_debut} au {item.date_fin}
                    </Text>
                    <Text style={{fontFamily: 'raleway_medium', color: '#323232', fontSize: 13 }}>{this.state.enterprise[count]}</Text>
                  </View>
                  <View style={{marginLeft: 40, height: 90, width: 3, backgroundColor: '#e6e6e6'}}></View>
                  <View style={{ backgroundColor: 'white' }}>
                    {this.generateEval(this.state.notebystage[count])}
                    {this.generateNote(this.state.compbystage[count])}
                  </View>
            </View>
      })}
      </ScrollView>
        <MessageBarAlert ref="alerterror" />
          </View>
        )
      }
  }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
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
        paddingLeft: 10
    },
    inputpassword: {
        width: 300,
        padding: 5,
        borderColor: 'grey',
        backgroundColor: 'rgba(0,0,0, 0.1)',
        marginTop: 20,
        paddingLeft: 10
    },
    inline_block: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        backgroundColor: 'white'
    },
    underlineText: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "#093996",
        color: '#9932CC'
    },
});

Stats.propTypes = {
    title: PropTypes.string.isRequired,
    onBack: PropTypes.func.isRequired,
    Disconnect: PropTypes.func.isRequired,
};
