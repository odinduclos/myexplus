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
 StatusBar,
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

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
        mail: '',
        password: '',
        stages: [],
        enterprise: [],
        isOpen: false,
        selectedItem: 'About',
        compbystage: [],
        validcompbystage: [],
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
                        this.getNameOfEnterprise(data[l].id_stage.id, result);
                        this.getCompForStage(data[l].id_stage.id, result);
                    }
                    this.setState({stages: newData});
                })
                .catch((error) => {
                     console.warn(error);
                });
            })
            .catch((error) => {
                 console.warn(error);
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
getCompForStage(id, token) {
  fetch('http://www.pierreriche.com:8000/mycompetences/' + id, {
   method: 'get',
   headers: {
     'X-Auth-Token': token,
   }
 })
 .then((response) => response.json())
 .then((dat) => {
    var countValidated = 0;
    for (var l = 0; l < dat.length; l++) {
      if (dat[l].validation_maitre_de_stage == 1) {
        countValidated++;
      }
    }
    var value = dat.length;
    var value2 = countValidated;
    this.state.compbystage[id] = value;
    this.state.validcompbystage[id] = value2;
    this.setState({
      compbystage: this.state.compbystage,
       validcompbystage: this.state.validcompbystage
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

showStage(id) {
  this.props.showStage(id);
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
      selectedItem: item,
    });
  }
  openMenu() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
  deconnexion() {
    AsyncStorage.removeItem('user_id', (err, result2) => {
      AsyncStorage.removeItem('user_token', (err2, result2) => {
        AsyncStorage.removeItem('stayconnected', (err3, result3) => {
          if (!err && !err2 && !err3) {
            this.props.onBack();
          }
        });
      });
    });
  }
  goStats() {
    return this.setState({
      isOpen: false
    }, this.props.showStats())
  }
  reload() {
    this.toggle();
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
                        this.getNameOfEnterprise(data[l].id_stage.id, result);
                        this.getCompForStage(data[l].id_stage.id, result);
                    }
                    this.setState({stages: newData});
                })
                .catch((error) => {
                     console.warn(error);
                });
            })
            .catch((error) => {
                 console.warn(error);
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
render() {
      var count = -1;
      const menu = <Menu showStats={this.goStats.bind(this)} onDisconnect={this.deconnexion.bind(this)} onItemSelected={this.onMenuItemSelected} showStage={this.showStage.bind(this)} reload={this.reload.bind(this)} />;
      if (this.state.stages == undefined) {
            return(
              <SideMenu
              menu={menu}
              disableGestures={true}
              isOpen={this.state.isOpen}
              onChange={(isOpen) => this.updateMenuState(isOpen)}>
                  <View style={styles.container}>
                        <View style={{  height: 50, backgroundColor: "white", flexDirection: "row" }}>
                              <TouchableOpacity onPress={this.openMenu.bind(this)}>
                                <Image source={require('./images/menu_30x30.png')} style={{ marginLeft: 20, marginTop: 10 }} />
                              </TouchableOpacity>
                              <Text style={{ fontFamily:"raleway_bold", color:"#00379b", marginLeft: 120, marginTop: 17.5 }}>Mes Stages</Text>
                        </View>
                        <Image source={require('./images/photo_nostage_412x682.png')} style={{ alignItems: "center" }}>
                              <Text style={{ fontFamily:"raleway", color:"white", width: 200, fontSize: 24, marginTop: 100 }}>Vous n'avez pas encore de stage.</Text>
                        </Image>
                  </View>
              </SideMenu>
            )
      } else {
            return(
              <SideMenu
              menu={menu}
              disableGestures={false}
              isOpen={this.state.isOpen}
              onChange={(isOpen) => this.updateMenuState(isOpen)}>
              <View style={{  height: 50, backgroundColor: "white", flexDirection: "row" }}>
                <TouchableOpacity onPress={this.openMenu.bind(this)}>
                    <Image source={require('./images/menu_30x30.png')} style={{ marginLeft: 20, marginTop: 10 }} />
                </TouchableOpacity>
                    <Text style={{ fontFamily:"raleway_bold", color:"#00379b", marginLeft: 120, marginTop: 17.5 }}>Mes Stages</Text>
              </View>
                  <View style={styles.container}>
                  <ScrollView
                  ref={(scrollView) => { _scrollView = scrollView; }}
                  automaticallyAdjustContentInsets={false}
                  onScroll={() => { console.log('onScroll!'); }}
                  scrollEventThrottle={200} >

                        {this.state.stages.map((item) => {
                        count++;
                        return <View key={item.id} style={{ backgroundColor: 'white', borderBottomColor: '#00379b', borderBottomWidth: 2, justifyContent: 'center'}}>
                              <Image source={{ uri: item.id_metier.photo_path }} style={{ height: 100, margin: 0 }} />
                              <View style={{ marginTop: 20, marginLeft: 40, backgroundColor: 'white' }}>
                                    <Text style={{ fontSize: 16, fontFamily: 'raleway_medium', color: '#00379b', fontSize: 16 }}>{item.id_metier.titre}</Text>
                                    <View style={{ flexDirection: "row", width: 300 }} >
                                          <View style={{ justifyContent: "flex-start", width: 160, marginTop: 15 }}>
                                                <Text style={{fontSize: 14, fontFamily: 'raleway_medium', color: '#323232', justifyContent: "flex-start", fontSize: 13 }}>{this.state.enterprise[count]}</Text>
                                          </View>
                                          <View style={{ justifyContent: "flex-end", width: 130 }}>
                                                <Text style={{ fontSize: 12, fontFamily: 'raleway_semibold', color: '#b45596', justifyContent: "flex-end" }}>
                                                      du {item.date_debut} au {item.date_fin}
                                                </Text>
                                          </View>
                                    </View>

                              </View>
                              <View style={{ marginTop: 17.5, marginLeft: 40,  backgroundColor: 'white', width: 300 }}>
                                    <Text style={{ fontSize: 12, fontFamily: 'raleway', color: '#323232', fontSize: 13 }}>{item.id_metier.definition}</Text>
                              </View>
                              <View style={{ marginTop: 20, marginLeft: 40, height: 60, width: 300, marginBottom: 10, marginTop: 20 ,backgroundColor: 'white', flexDirection: "row" }}>
                                    <Text style={{ fontFamily:"raleway_semibold", color:"#323232", width: 210, marginTop: 11 }}>{this.state.compbystage[item.id]} compétences ({this.state.validcompbystage[item.id]} validées)</Text>
                                    <Button onPress={(this.showStage.bind(this, item.id))}
                                    containerStyle={{ padding:11, height:45, overflow:'hidden', borderRadius:22, backgroundColor: '#093996', width: 90 }}
                                    style={{ fontSize: 15, color: 'white', fontFamily: 'raleway' }}>Voir</Button>
                              </View>
                        </View>
                  })}
                        </ScrollView>
                        <MessageBarAlert ref="alerterror" />
                  </View>
                  </SideMenu>
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

Home.propTypes = {
    title: PropTypes.string.isRequired,
    showStage: PropTypes.func.isRequired,
    showStats: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    donnee: PropTypes.string.isRequired,
    id: PropTypes.integer,
};
